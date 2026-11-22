// The dialog listens to clicks only to close on its backdrop; Escape closes it natively.

import { consume } from '@lit/context';
import { createPopper, type Instance as PopperInstance } from '@popperjs/core';
import hljs from 'highlight.js';
import { LitElement, html, isServer, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import type { LightTheme } from '../../types.js';
import { resetServerRenderedRoot } from '../_private/serverRenderedRoot.js';
import '../discord-link/DiscordLink.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';
import AttachmentDownloadButton, {
	AttachmentLanguageSearchSvg,
	AttachmentLanguageSearchXSvg,
	AttachmentLanguageSelectorSvg
} from '../svgs/AttachmentDownloadButton.js';
import {
	TextFileCheckSvg,
	TextFileCloseSvg,
	TextFileCodeSvg,
	TextFileExpandSvg,
	TextFileMaximizeSvg,
	TextFileMoreSvg
} from '../svgs/TextFilePreview.js';

const getAllLanguages = () => {
	const languages = new Set<string>();

	for (const language of hljs.listLanguages()) {
		languages.add(language);
		const data = hljs.getLanguage(language);
		if (data?.aliases) {
			for (const alias of data.aliases) {
				languages.add(alias);
			}
		}
	}

	return [...languages].sort((a, b) => a.localeCompare(b));
};

const allLanguages = getAllLanguages();

/**
 * Lines shown before "show more", when the size cannot be measured (server rendering).
 */
const COLLAPSED_LINES = 6;

const SPAN_TOKEN = /<span[^>]*>|<\/span>|\n|[^\n<]+|</g;

/**
 * Split highlight.js output into one HTML string per line. A token can span lines (a block comment,
 * a template string), so the spans open at a line break are closed there and reopened on the next
 * line, keeping every line valid on its own.
 */
function splitHighlightedLines(highlighted: string): string[] {
	const lines: string[] = [];
	const open: string[] = [];
	let current = '';

	for (const [token] of highlighted.matchAll(SPAN_TOKEN)) {
		if (token === '\n') {
			lines.push(current + '</span>'.repeat(open.length));
			current = open.join('');
		} else if (token.startsWith('<span')) {
			open.push(token);
			current += token;
		} else if (token === '</span>') {
			open.pop();
			current += token;
		} else {
			current += token;
		}
	}

	lines.push(current);
	return lines;
}

/**
 * "HTML" for `html`, "TypeScript" for `ts`, the language itself when highlight.js does not know it.
 */
function languageLabel(language: string | undefined): string {
	if (!language) return 'Plain Text';
	const name = hljs.getLanguage(language)?.name;
	if (!name) return language.toUpperCase();

	// Some definitions cover several languages ("HTML, XML"): show the one that was asked for.
	const parts = name.split(',').map((part) => part.trim());
	return parts.find((part) => part.toLowerCase() === language.toLowerCase()) ?? parts[0];
}

type Popup = 'language' | 'menu';

/**
 * `<dialog closedby="any">` closes on a backdrop click natively; elsewhere a pointer fallback does.
 */
const supportsClosedBy = !isServer && 'closedBy' in HTMLDialogElement.prototype;
type Place = 'full' | 'inline';

@customElement('discord-text-file-attachment-previewer')
export class DiscordTextFileAttachmentPreviewer extends LitElement implements LightTheme {
	/**
	 * The name of the file
	 *
	 * @example
	 * ```ts
	 * 'example.txt'
	 * ```
	 */
	@property()
	public name: string;

	/**
	 * The language used to highlight the content. Viewers can change it from the preview.
	 *
	 * @example
	 * ```ts
	 * 'ts'
	 * ```
	 */
	@property()
	public language: string;

	/**
	 * The text content of the file
	 */
	@property()
	public content: string;

	/**
	 * The size of the file in bytes
	 *
	 * @remarks The unit is not automatically calculated,
	 * you should provide it manually through {@link DiscordTextFileAttachmentPreviewer.bytesUnit | `bytesUnit`}
	 * @example
	 * ```ts
	 * 1024
	 * ```
	 */
	@property({ type: Number })
	public bytes: number;

	/**
	 * The unit of the file in a human-readable format
	 *
	 * @example
	 * ```ts
	 * 'KB'
	 * ```
	 */
	@property({ attribute: 'bytes-unit' })
	public bytesUnit: string;

	/**
	 * The URL to the file, used by the "Download" menu item
	 *
	 * @example
	 * ```ts
	 * 'https://example.com/example.txt'
	 * ```
	 */
	@property()
	public href: string;

	/**
	 * Whether long lines wrap instead of scrolling sideways, as Discord does by default. Viewers can
	 * toggle it from the menu. Set `wrap-text="false"` to start with it off.
	 */
	@property({
		reflect: true,
		attribute: 'wrap-text',
		converter: {
			fromAttribute: (value) => value !== 'false',
			toAttribute: (value: boolean) => (value ? '' : 'false')
		}
	})
	public wrapText = true;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public lightTheme = false;

	/**
	 * Whether the inline preview shows more lines.
	 */
	@state()
	private expanded = false;

	/**
	 * Whether the full view (a modal dialog) is open.
	 */
	@state()
	private fullView = false;

	/**
	 * The open popup, and the footer (inline or full view) that opened it.
	 */
	@state()
	private popup: { kind: Popup; place: Place } | null = null;

	@state()
	private currentSearch = '';

	/**
	 * Whether the collapsed preview hides content, measured once rendered.
	 */
	@state()
	private overflowing: boolean | undefined;

	private lines: string[] = [];

	private popper: PopperInstance | null = null;

	/**
	 * The trigger pressed while its popup was open. Light dismiss may already have closed the popup by
	 * the time its click arrives, so the click must not open it again.
	 */
	private pressedOpenTrigger: string | null = null;

	/**
	 * Whether the open popup was opened from the keyboard, which moves focus into it.
	 */
	private openedFromKeyboard = false;

	private wrapCloseTimeout: number | undefined;

	/**
	 * Whether the pointer went down outside the full view, for the light-dismiss fallback.
	 */
	private pressedOutsideDialog = false;

	private readonly dialogRef = createRef<HTMLDialogElement>();

	private readonly inlineBodyRef = createRef<HTMLDivElement>();

	private readonly inputRef = createRef<HTMLInputElement>();

	protected override createRenderRoot() {
		resetServerRenderedRoot(this, true);
		return this;
	}

	/**
	 * Open the language selector of the inline preview. Kept for the 4.x API.
	 */
	public showSelector() {
		this.openPopup('language', 'inline');
	}

	/**
	 * Close any open popup. Kept for the 4.x API.
	 */
	public hideSelector() {
		this.closePopup();
	}

	public override disconnectedCallback(): void {
		super.disconnectedCallback();
		this.closePopup();
		this.dialogRef.value?.close();
	}

	protected override willUpdate(changed: PropertyValues): void {
		if (changed.has('content') || changed.has('language') || this.lines.length === 0) {
			const language = this.language && hljs.getLanguage(this.language) ? this.language : 'plaintext';
			const content = (this.content ?? '').replaceAll(/\r\n?/g, '\n').replace(/\n$/, '');
			this.lines = splitHighlightedLines(hljs.highlight(content, { language }).value);
		}

		if (changed.has('content') || changed.has('wrapText')) this.overflowing = undefined;
	}

	protected override updated(changed: PropertyValues): void {
		super.updated(changed);

		const body = this.inlineBodyRef.value;
		if (body && this.overflowing === undefined && !this.expanded) {
			this.overflowing = body.scrollHeight > body.clientHeight + 1;
		}

		if (changed.has('fullView')) {
			const dialog = this.dialogRef.value;
			if (this.fullView && dialog && !dialog.open) dialog.showModal();
		}

		if (changed.has('popup')) this.showPopup();
	}

	private isPopupOpen(kind: Popup, place: Place) {
		return this.popup?.kind === kind && this.popup.place === place;
	}

	private openPopup(kind: Popup, place: Place, fromKeyboard = false) {
		window.clearTimeout(this.wrapCloseTimeout);
		this.popper?.destroy();
		this.popper = null;
		this.currentSearch = '';
		this.openedFromKeyboard = fromKeyboard;
		this.popup = { kind, place };
	}

	/**
	 * Close the open popup. Focus goes back to its trigger when it was inside the popup, without a
	 * focus ring after a pointer action.
	 */
	private closePopup(focusVisible = true) {
		const elements = this.popupElements();
		if (elements?.popup.contains(document.activeElement)) {
			elements.anchor.focus({ preventScroll: true, focusVisible } as FocusOptions);
		}

		window.clearTimeout(this.wrapCloseTimeout);
		this.popper?.destroy();
		this.popper = null;
		this.popup = null;
		this.currentSearch = '';
	}

	private popupElements() {
		if (!this.popup) return null;
		const { kind, place } = this.popup;
		const anchor = this.querySelector<HTMLElement>(`[data-popup-anchor="${place}-${kind}"]`);
		const popup = this.querySelector<HTMLElement>(`[data-popup="${place}-${kind}"]`);
		return anchor && popup ? { anchor, popup } : null;
	}

	private showPopup() {
		const elements = this.popupElements();
		if (!elements) return;
		const { anchor, popup } = elements;

		// A popover sits in the top layer, above later messages and inside the full view's dialog.
		// `source` keeps the trigger out of light dismiss, so clicking it toggles the popup.
		if (typeof popup.showPopover === 'function') {
			(popup as HTMLElement & { showPopover(options?: { source?: HTMLElement }): void }).showPopover({ source: anchor });
		}

		this.popper = createPopper(anchor, popup, {
			placement: 'top-end',
			strategy: 'fixed',
			modifiers: [
				{ name: 'offset', options: { offset: [0, 8] } },
				{ name: 'flip', options: { fallbackPlacements: ['bottom-end', 'left-start'] } },
				{ name: 'preventOverflow', options: { padding: 8 } }
			]
		});

		if (this.popup?.kind === 'language') this.inputRef.value?.focus({ preventScroll: true });
		else if (this.openedFromKeyboard) popup.querySelector<HTMLElement>('.tfp-menu-item')?.focus({ preventScroll: true });
	}

	private handlePopupToggle(event: ToggleEvent) {
		// Light dismiss or Escape closed it natively: drop it from the state too. A late event from a
		// popup that was already replaced is ignored.
		if (event.newState === 'closed' && event.target === this.popupElements()?.popup) this.closePopup();
	}

	private handleTriggerPointerDown(kind: Popup, place: Place) {
		this.pressedOpenTrigger = this.isPopupOpen(kind, place) ? `${place}-${kind}` : null;
	}

	private handleTriggerClick(event: MouseEvent, kind: Popup, place: Place) {
		const wasOpen = this.pressedOpenTrigger === `${place}-${kind}` || this.isPopupOpen(kind, place);
		this.pressedOpenTrigger = null;

		// A click with no pointer (`detail` 0) came from Enter or Space.
		if (wasOpen) this.closePopup(event.detail === 0);
		else this.openPopup(kind, place, event.detail === 0);
	}

	private handleMenuTriggerKeydown(event: KeyboardEvent, place: Place) {
		if (event.key !== 'ArrowDown') return;
		event.preventDefault();

		if (this.isPopupOpen('menu', place)) this.popupElements()?.popup.querySelector<HTMLElement>('.tfp-menu-item')?.focus();
		else this.openPopup('menu', place, true);
	}

	private handleMenuKeydown(event: KeyboardEvent) {
		const items = [...(event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('.tfp-menu-item')];
		const current = items.indexOf(document.activeElement as HTMLElement);
		const last = items.length - 1;

		let next: number;
		switch (event.key) {
			case 'ArrowDown':
				next = current >= last ? 0 : current + 1;
				break;
			case 'ArrowUp':
				next = current <= 0 ? last : current - 1;
				break;
			case 'Home':
				next = 0;
				break;
			case 'End':
				next = last;
				break;
			case 'Tab':
				// Tab leaves the menu and closes it; focus moves on as usual.
				this.popper?.destroy();
				this.popper = null;
				this.popup = null;
				return;
			default:
				return;
		}

		event.preventDefault();
		items[next]?.focus();
	}

	private toggleExpanded() {
		this.expanded = !this.expanded;
	}

	private openFullView() {
		this.closePopup();
		this.fullView = true;
	}

	private closeFullView() {
		this.closePopup();
		this.dialogRef.value?.close();
	}

	private handleDialogClose() {
		this.fullView = false;
		this.closePopup();
	}

	private isOutsideDialog(event: PointerEvent) {
		const dialog = this.dialogRef.value;
		if (!dialog || (event.target as Element).closest('[popover]')) return false;
		const rect = dialog.getBoundingClientRect();
		return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
	}

	// Light-dismiss fallback where `closedby` is missing. It tests the pointer position, not the
	// target, and needs both the press and the release outside, so a text selection that ends on the
	// backdrop does not close the full view.
	private handleDialogPointerDown(event: PointerEvent) {
		if (supportsClosedBy) return;
		this.pressedOutsideDialog = this.isOutsideDialog(event);
	}

	private handleDialogPointerUp(event: PointerEvent) {
		if (supportsClosedBy) return;
		if (this.pressedOutsideDialog && this.isOutsideDialog(event)) this.closeFullView();
		this.pressedOutsideDialog = false;
	}

	private toggleWrap(event: MouseEvent) {
		this.wrapText = !this.wrapText;
		// Keep the menu up for a moment so the changed check mark is visible.
		const focusVisible = event.detail === 0;
		this.wrapCloseTimeout = window.setTimeout(() => this.closePopup(focusVisible), 300);
	}

	private selectLanguage(event: MouseEvent, language: string) {
		this.language = language;
		this.closePopup(event.detail === 0);
	}

	private handleSearchInput(event: Event) {
		this.currentSearch = (event.target as HTMLInputElement).value.toLowerCase();
	}

	private clearSearch(event: MouseEvent) {
		if (this.inputRef.value) this.inputRef.value.value = '';
		this.currentSearch = '';
		event.stopPropagation();
	}

	private renderLines() {
		return html`<div class="tfp-code">
			${this.lines.map(
				(line, index) =>
					html`<span class="tfp-line-number" aria-hidden="true">${index + 1}</span
						><span class="tfp-line">${line ? unsafeHTML(line) : '​'}</span>`
			)}
		</div>`;
	}

	private renderHeader(place: Place) {
		return html`<div class="tfp-header">
			<span class="tfp-language">${TextFileCodeSvg()}<span>${languageLabel(this.language)}</span></span>
			${
				place === 'full'
					? html`<button class="tfp-button" aria-label="Close" @click=${this.closeFullView}>${TextFileCloseSvg()}</button>`
					: nothing
			}
		</div>`;
	}

	private renderLanguageSelector(place: Place) {
		let shown = 0;

		return html`<div
			class="language-selector"
			popover="auto"
			aria-label="Change language"
			data-popup="${place}-language"
			@toggle=${this.handlePopupToggle}
		>
			<label class="language-selector-input-container">
				<input
					type="text"
					placeholder="Search language"
					aria-label="Search language"
					class="language-selector-input"
					@input=${this.handleSearchInput}
					${ref(this.inputRef)}
				/>
				${
					this.currentSearch.length > 0
						? html`<button class="cancel-search" aria-label="Clear search" @click=${this.clearSearch}>
								${AttachmentLanguageSearchXSvg()}
							</button>`
						: html`<span class="search-button">${AttachmentLanguageSearchSvg()}</span>`
				}
			</label>
			<ul tabindex="-1">
				${allLanguages.map((language) => {
					if (this.currentSearch && !language.toLowerCase().includes(this.currentSearch)) return null;
					shown++;
					return html`<li>
						<button
							class=${classMap({ 'language-selector-item': true, selected: this.language === language })}
							@click=${(event: MouseEvent) => this.selectLanguage(event, language)}
						>
							${language}
						</button>
					</li>`;
				})}
			</ul>
			${
				shown === 0
					? html`<div class="no-results">
							<h3>Nope!</h3>
							<p>Did you make a mistake when writing?</p>
						</div>`
					: nothing
			}
		</div>`;
	}

	private renderMenu(place: Place) {
		return html`<div
			class="tfp-menu"
			role="menu"
			aria-label="More"
			popover="auto"
			data-popup="${place}-menu"
			@toggle=${this.handlePopupToggle}
			@keydown=${this.handleMenuKeydown}
		>
			<a
				class="tfp-menu-item"
				role="menuitem"
				href=${ifDefined(this.href)}
				target="_blank"
				rel="noreferrer noopener"
				download=${ifDefined(this.name)}
				@click=${(event: MouseEvent) => this.closePopup(event.detail === 0)}
			>
				<span>Download</span>${AttachmentDownloadButton()}
			</a>
			<button class="tfp-menu-item" role="menuitemcheckbox" aria-checked=${this.wrapText ? 'true' : 'false'} @click=${this.toggleWrap}>
				<span>Wrap Text</span>
				<span class=${classMap({ 'tfp-checkbox': true, checked: this.wrapText })}>${this.wrapText ? TextFileCheckSvg() : nothing}</span>
			</button>
		</div>`;
	}

	private renderFooter(place: Place) {
		const canExpand = this.overflowing ?? this.lines.length > COLLAPSED_LINES;
		const open = (kind: Popup) => this.popup?.kind === kind && this.popup.place === place;

		return html`<div class="tfp-footer">
			${
				place === 'inline' && (canExpand || this.expanded)
					? html`<button
							class=${classMap({ 'tfp-button': true, 'tfp-expand': true, expanded: this.expanded })}
							aria-label=${this.expanded ? 'Show less' : 'Show more'}
							aria-expanded=${this.expanded ? 'true' : 'false'}
							@click=${this.toggleExpanded}
						>
							${TextFileExpandSvg()}
						</button>`
					: nothing
			}
			<span class="tfp-file">
				<span class="tfp-file-name" title=${ifDefined(this.name)}>${this.name}</span>
				<span class="tfp-file-size">${this.bytes}${this.bytesUnit ? ` ${this.bytesUnit}` : ''}</span>
			</span>
			<span class="tfp-actions">
				<button
					class=${classMap({ 'tfp-button': true, active: open('language') })}
					aria-label="Change language"
					aria-expanded=${open('language') ? 'true' : 'false'}
					data-popup-anchor="${place}-language"
					@pointerdown=${() => this.handleTriggerPointerDown('language', place)}
					@click=${(event: MouseEvent) => this.handleTriggerClick(event, 'language', place)}
				>
					${AttachmentLanguageSelectorSvg()}
				</button>
				${
					place === 'inline'
						? html`<button class="tfp-button" aria-label="Expand" @click=${this.openFullView}>${TextFileMaximizeSvg()}</button>`
						: nothing
				}
				<button
					class=${classMap({ 'tfp-button': true, active: open('menu') })}
					aria-label="More"
					aria-haspopup="menu"
					aria-expanded=${open('menu') ? 'true' : 'false'}
					data-popup-anchor="${place}-menu"
					@pointerdown=${() => this.handleTriggerPointerDown('menu', place)}
					@click=${(event: MouseEvent) => this.handleTriggerClick(event, 'menu', place)}
					@keydown=${(event: KeyboardEvent) => this.handleMenuTriggerKeydown(event, place)}
				>
					${TextFileMoreSvg()}
				</button>
			</span>
			${open('language') ? this.renderLanguageSelector(place) : nothing} ${open('menu') ? this.renderMenu(place) : nothing}
		</div>`;
	}

	protected override render() {
		return html`
			<div class=${classMap({ 'tfp-card': true, 'tfp-wrap': this.wrapText })}>
				${this.renderHeader('inline')}
				<div class=${classMap({ 'tfp-body': true, expanded: this.expanded })} tabindex="0" ${ref(this.inlineBodyRef)}>
					${this.renderLines()}
				</div>
				${this.renderFooter('inline')}
			</div>
			<dialog
				class=${classMap({ 'tfp-dialog': true, 'tfp-wrap': this.wrapText })}
				aria-label=${ifDefined(this.name)}
				closedby="any"
				${ref(this.dialogRef)}
				@close=${this.handleDialogClose}
				@pointerdown=${this.handleDialogPointerDown}
				@pointerup=${this.handleDialogPointerUp}
			>
				${
					this.fullView
						? html`<div class="tfp-card tfp-card-full">
								${this.renderHeader('full')}
								<div class="tfp-body" tabindex="0">${this.renderLines()}</div>
								${this.renderFooter('full')}
							</div>`
						: nothing
				}
			</dialog>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-text-file-attachment-previewer': DiscordTextFileAttachmentPreviewer;
	}
}
