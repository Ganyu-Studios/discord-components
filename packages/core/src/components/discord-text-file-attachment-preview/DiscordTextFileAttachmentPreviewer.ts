import { consume } from '@lit/context';
import { createPopper } from '@popperjs/core';
import hljs from 'highlight.js';
import { LitElement, html, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import type { LightTheme } from '../../types.js';
import '../discord-link/DiscordLink.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';
import AttachmentDownloadButton, {
	AttachmentLanguageSearchSvg,
	AttachmentLanguageSearchXSvg,
	AttachmentLanguageSelectorSvg
} from '../svgs/AttachmentDownloadButton.js';

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

@customElement('discord-text-file-attachment-previewer')
export class DiscordTextFileAttachmentPreviewer extends LitElement implements LightTheme {
	public constructor() {
		super();
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

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

	@property()
	public language: string;

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
	 * The URL to the file, this is passed to `<discord-link>`
	 *
	 * @example
	 * ```ts
	 * 'https://example.com/example.txt'
	 * ```
	 */
	@property()
	public href: string;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public lightTheme = false;

	protected override createRenderRoot() {
		return this;
	}

	@state()
	private currentSearch = '';

	private handleSearchInput(event: Event) {
		const typedEventTarget = event.target as HTMLInputElement;
		this.currentSearch = typedEventTarget.value.toLowerCase();
	}

	private clearSearch(event: MouseEvent) {
		if (this.inputRef.value) this.inputRef.value.value = '';
		this.currentSearch = '';
		event.stopPropagation();
	}

	private selectLanguage(language: string) {
		this.language = language;
		this.hideSelector();
	}

	public inputRef = createRef<HTMLInputElement>();

	public languageSelectorContainer = createRef<HTMLDivElement>();

	public languageSelectorButton = createRef<HTMLButtonElement>();

	@state()
	private isLanguageSelectorVisible = false;

	public showSelector() {
		this.currentSearch = '';
		this.isLanguageSelectorVisible = true;
	}

	public hideSelector() {
		this.isLanguageSelectorVisible = false;
		this.currentSearch = '';
		this.removeHandleClickOutside();
	}

	private popper: ReturnType<typeof createPopper> | null = null;

	private isFirstClickDispatch = true;

	private removeHandleClickOutside(destroyPopper = false) {
		if (this.popper && destroyPopper) this.popper.destroy();
		window.removeEventListener('click', this.handleClickOutside);
		this.isFirstClickDispatch = true;
	}

	public override disconnectedCallback(): void {
		super.disconnectedCallback();
		this.removeHandleClickOutside(true);
	}

	private handleClickOutside(event: MouseEvent) {
		if (this.isFirstClickDispatch) {
			this.isFirstClickDispatch = false;
			return;
		}

		let target = event.target as HTMLElement | null;

		const languageSelectorContainer = this.languageSelectorContainer.value;

		if (!languageSelectorContainer) {
			this.hideSelector();
			return;
		}

		while (target) {
			if (target === languageSelectorContainer) {
				return;
			}

			target = target.parentElement;
		}

		this.hideSelector();
	}

	public override updated(changed: PropertyValues): void {
		if (!this.languageSelectorContainer.value || !this.languageSelectorButton.value) return;

		if (!changed.has('isLanguageSelectorVisible')) return;

		const oldisLanguageSelectorVisibleValue = changed.get('isLanguageSelectorVisible');

		if (oldisLanguageSelectorVisibleValue === true) {
			this.removeHandleClickOutside();
			return;
		}

		this.popper = createPopper(this.languageSelectorButton.value, this.languageSelectorContainer.value, {
			placement: 'left-start',
			strategy: 'fixed',
			modifiers: [
				{
					name: 'offset',
					options: {
						offset: [0, 8]
					}
				}
			]
		});

		window.addEventListener('click', this.handleClickOutside);
	}

	protected override render() {
		let filteredLanguages = 0;

		return html`
			<discord-code-block language=${this.language} code=${this.content}></discord-code-block>
			<div class="file-metadata">
				<span class="file-metadata-name">${this.name}</span>
				<span class="file-metadata-size"
					>${this.bytes}${when(
						this.bytesUnit,
						() => html` ${this.bytesUnit}`,
						() => null
					)}
				</span>
				<button class="discord-button-download-attachment" tabindex="-1">
					<a
						class="discord-link-download-attachment"
						aria-label="Download"
						href="${ifDefined(this.href)}"
						rel="noreferrer noopener"
						target="_blank"
						role="button"
						tabindex="0"
						download
					>
						${AttachmentDownloadButton()}
					</a>
				</button>
				<button class="discord-button-download-attachment" @click=${this.showSelector} ${ref(this.languageSelectorButton)}>
					${AttachmentLanguageSelectorSvg()}
				</button>

				${when(
					this.isLanguageSelectorVisible,
					() => html`
						<div class="language-selector" ${ref(this.languageSelectorContainer)}>
							<label class="language-selector-input-container">
								<input
									type="text"
									placeholder="Search language"
									class="language-selector-input"
									@input=${this.handleSearchInput}
									${ref(this.inputRef)}
								/>
								${when(
									this.currentSearch.length > 0,
									() => html`<button class="cancel-search" @click=${this.clearSearch}>${AttachmentLanguageSearchXSvg()}</button>`,
									() => html`<button tabindex="-1" class="search-button">${AttachmentLanguageSearchSvg()}</button>`
								)}
							</label>
							<ul tabindex="-1">
								${allLanguages.map((language) => {
									if (this.currentSearch && !language.toLowerCase().includes(this.currentSearch)) return null;
									filteredLanguages++;
									return html`<li>
										<button
											class=${classMap({
												'language-selector-item': true,
												selected: this.language === language
											})}
											tabindex="-1"
											@click=${() => this.selectLanguage(language)}
										>
											${language}
										</button>
									</li>`;
								})}
							</ul>
							${when(
								filteredLanguages === 0,
								() =>
									html`<div class="no-results">
										<h3>Nop!</h3>
										<p>Did you make a mistake when writing?</p>
									</div>`
							)}
						</div>
					`
				)}
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-text-file-attachment-previewer': DiscordTextFileAttachmentPreviewer;
	}
}
