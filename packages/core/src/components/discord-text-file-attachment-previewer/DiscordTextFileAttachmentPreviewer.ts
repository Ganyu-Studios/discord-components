// The dialog listens to clicks only to close on its backdrop; Escape closes it natively.
/* eslint-disable lit-a11y/click-events-have-key-events */
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

	private readonly dialogRef = createRef<HTMLDialogElement>();

	private readonly inlineBodyRef = createRef<HTMLDivElement>();

	private readonly inputRef = createRef<HTMLInputElement>();

	public constructor() {
		super();
		this.handleOutsidePointer = this.handleOutsidePointer.bind(this);
		this.handleKeydown = this.handleKeydown.bind(this);
	}

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

		if (changed.has('popup')) this.positionPopup();
	}

	private openPopup(kind: Popup, place: Place) {
		if (this.popup?.kind === kind && this.popup.place === place) {
			this.closePopup();
			return;
		}

		this.popper?.destroy();
		this.popper = null;
		this.currentSearch = '';
		this.popup = { kind, place };
		document.addEventListener('pointerdown', this.handleOutsidePointer, true);
		document.addEventListener('keydown', this.handleKeydown, true);
	}

	private closePopup() {
		this.popper?.destroy();
		this.popper = null;
		this.popup = null;
		this.currentSearch = '';
		if (isServer) return;
		document.removeEventListener('pointerdown', this.handleOutsidePointer, true);
		document.removeEventListener('keydown', this.handleKeydown, true);
	}

	private popupElements() {
		if (!this.popup) return null;
		const { kind, place } = this.popup;
		const anchor = this.querySelector<HTMLElement>(`[data-popup-anchor="${place}-${kind}"]`);
		const popup = this.querySelector<HTMLElement>(`[data-popup="${place}-${kind}"]`);
		return anchor && popup ? { anchor, popup } : null;
	}

	private positionPopup() {
		const elements = this.popupElements();
		if (!elements) return;

		// The top layer keeps the popup above later messages and inside the full view's dialog.
		if (typeof elements.popup.showPopover === 'function') elements.popup.showPopover();

		this.popper = createPopper(elements.anchor, elements.popup, {
			placement: 'top-end',
			strategy: 'fixed',
			modifiers: [
				{ name: 'offset', options: { offset: [0, 8] } },
				{ name: 'flip', options: { fallbackPlacements: ['bottom-end', 'left-start'] } },
				{ name: 'preventOverflow', options: { padding: 8 } }
			]
		});

		if (this.popup?.kind === 'language') this.inputRef.value?.focus({ preventScroll: true });
	}

	private handleOutsidePointer(event: PointerEvent) {
		const elements = this.popupElements();
		const path = event.composedPath();
		if (elements && (path.includes(elements.popup) || path.includes(elements.anchor))) return;
		this.closePopup();
	}

	private handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape') return;
		// Close the popup first; a second Escape closes the full view.
		event.preventDefault();
		event.stopPropagation();
		this.closePopup();
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

	private handleDialogClick(event: MouseEvent) {
		// A click on the backdrop lands on the dialog itself.
		if (event.target === this.dialogRef.value) this.closeFullView();
	}

	private toggleWrap() {
		this.wrapText = !this.wrapText;
		this.closePopup();
	}

	private selectLanguage(language: string) {
		this.language = language;
		this.closePopup();
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

		return html`<div class="language-selector" popover="manual" data-popup="${place}-language">
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
							@click=${() => this.selectLanguage(language)}
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
		return html`<div class="tfp-menu" role="menu" popover="manual" data-popup="${place}-menu">
			<a
				class="tfp-menu-item"
				role="menuitem"
				href=${ifDefined(this.href)}
				target="_blank"
				rel="noreferrer noopener"
				download=${ifDefined(this.name)}
				@click=${this.closePopup}
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
					@click=${() => this.openPopup('language', place)}
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
					@click=${() => this.openPopup('menu', place)}
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
				${ref(this.dialogRef)}
				@close=${this.handleDialogClose}
				@click=${this.handleDialogClick}
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
