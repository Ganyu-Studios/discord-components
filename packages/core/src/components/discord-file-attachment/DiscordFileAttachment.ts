import { consume } from '@lit/context';
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import type { LightTheme } from '../../types.js';
import '../discord-link/DiscordLink.js';
import { DiscordMediaSpoileableCover } from '../discord-media-spoileable-cover/DiscordMediaSpoileableCover.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';
import AttachmentDownloadButton from '../svgs/AttachmentDownloadButton.js';
import FileAttachment from '../svgs/FileAttachment.js';

@customElement('discord-file-attachment')
export class DiscordFileAttachment extends LitElement implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = [
		css`
			:host {
				display: grid;
				height: -moz-fit-content;
				height: fit-content;
				grid-auto-flow: row;
				grid-row-gap: 0.25rem;
				grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
				text-indent: 0;
				min-height: 0;
				min-width: 0;
				padding-top: 0.125rem;
				padding-bottom: 0.125rem;
				position: relative;
				border-radius: 8px;
				--shadow-color: hsl(none 0% 0%/0.14);
				box-shadow: 0 1px 4px 0 var(--shadow-color);
			}

			:host([light-theme]) {
				--shadow-color: hsl(none 0% 0%/0.08);
			}

			:host > * {
				justify-self: start;
				align-self: start;
			}

			.discord-file-attachment-non-visual-media-item-container:hover .discord-button-download-attachment {
				display: block !important;
			}

			.discord-button-download-attachment {
				display: none;
				position: absolute;
				top: -8px;
				right: -8px;
				border-radius: 5px;
				overflow: hidden;
				outline: 1px solid color-mix(in oklab, hsl(231.429 calc(1 * 6.542%) 20.98% /1) 100%, #000 0%);
				background-color: color-mix(in oklab, hsl(232.5 calc(1 * 6.897%) 22.745% /1) 100%, #000 0%);

				&:hover {
					background-color: #3c3d43;
				}
			}

			:host:has(discord-media-spoileable-cover:not([is-revealed])) .discord-button-download-attachment {
				display: none !important;
			}

			.discord-link-download-attachment {
				color: color-mix(in oklab, hsl(215 calc(1 * 8.8%) 73.3% / 1) 100%, black 0%);
				display: flex;
			}

			.discord-icon-download {
				padding: 6px;
			}

			.discord-file-attachment-non-visual-media-item-container {
				margin-top: var(--media-item-container-margin-top, 8px);
				max-width: 100%;
				display: flex;
				flex-direction: column;
				position: relative;
			}

			.discord-file-attachment-non-visual-media-item {
				width: -moz-fit-content;
				width: fit-content;
				max-width: 100%;
			}

			.discord-file-attachment-mosaic-item-media {
				position: relative;
				max-height: inherit;
				border-radius: 2px;
				width: 100%;
				align-items: center;
				display: flex;
				flex-flow: row nowrap;
				max-width: 100%;
				height: 100%;
				overflow: hidden;
			}

			.discord-file-attachment-mosaic-style {
				padding: 16px;
				border-radius: 8px;
				width: 432px;
				max-width: 100%;
				flex: auto;
				background-color: var(--background, #393a41);
				align-items: center;
				flex-direction: row;
				display: flex;
				box-sizing: border-box;
				letter-spacing: 0;
				border: 1px solid var(--border-color, #44454c);
			}

			.discord-file-attachment-light-theme.discord-file-attachment-mosaic-style {
				--background: color-mix(in oklab, hsl(0 calc(1 * 0%) 100% /1) 100%, #000 0%);
				--border-color: color-mix(in oklab, hsl(240 calc(1 * 4%) 60.784% /0.2784313725490196) 100%, hsl(0 0% 0% /0.2784313725490196) 0%);
			}

			.discord-file-attachment-icon {
				width: 30px;
				height: 40px;
				margin-right: 8px;
				flex-shrink: 0;
			}

			.discord-file-attachment-inner {
				flex: 1;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}

			.discord-file-attachment-filename-link-wrapper {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				font-size: 16px;
			}

			.discord-file-attachment-metadata {
				line-height: 16px;
				font-size: 12px;
				font-weight: 400;
				color: #adaeb4;
				margin-right: 8px;
			}

			.discord-file-attachment-light-theme .discord-file-attachment-metadata {
				color: #6d6e77;
			}

			.discord-button-download-attachment-light-theme {
				outline-color: #fbfbfb;
				.discord-link-download-attachment {
					background-color: #fbfbfb;
					color: #5f606a;
				}
				&:hover {
					outline-color: #e4e4e4 !important;
					.discord-link-download-attachment {
						background-color: #e4e4e4;
						color: #2e2f34;
					}
				}
			}
		`,
		DiscordMediaSpoileableCover.hostStyles
	];

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
	 * The size of the file in bytes
	 *
	 * @remarks The unit is not automatically calculated,
	 * you should provide it manually through {@link DiscordFileAttachment.bytesUnit | `bytesUnit`}
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

	/**
	 * The `<a>` tag {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#rel | `rel`},
	 * this is passed to `<discord-link>`
	 */
	@property()
	public rel: string;

	/**
	 * The `<a>` tag {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target | `target`},
	 * this is passed to `<discord-link>`
	 */
	@property()
	public target: '_blank' | '_parent' | '_self' | '_top';

	/**
	 * The `<a>` tag {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#type | `type`},
	 * this is passed to `<discord-link>`
	 */
	@property()
	public type: string;

	@property({ type: Boolean, reflect: true })
	public spoiler = false;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public lightTheme = false;

	protected override render() {
		return html` <div class="discord-file-attachment-non-visual-media-item-container">
			<div class="discord-file-attachment-non-visual-media-item">
				<div class="discord-file-attachment-mosaic-item-media">
					${DiscordMediaSpoileableCover.inject(this.spoiler, this.lightTheme)}
					<div class=${classMap({ 'discord-file-attachment-mosaic-style': true, 'discord-file-attachment-light-theme': this.lightTheme })}>
						${FileAttachment({
							class: 'discord-file-attachment-icon',
							alt: 'Attachment file type: unknown',
							title: 'unknown',
							type: this.type
						})}
						<div class="discord-file-attachment-inner">
							<div class="discord-file-attachment-filename-link-wrapper">
								<discord-link
									href=${ifDefined(this.href)}
									rel=${ifDefined(this.rel)}
									target=${ifDefined(this.target)}
									type=${ifDefined(this.type)}
								>
									${this.name}
								</discord-link>
							</div>
							<div class="discord-file-attachment-metadata">
								${this.bytes}${when(
									this.bytesUnit,
									() => html` ${this.bytesUnit}`,
									() => null
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				class=${classMap({
					'discord-button-download-attachment': true,
					'discord-button-download-attachment-light-theme': this.lightTheme
				})}
			>
				<a
					class="discord-link-download-attachment"
					aria-label="Download"
					href="${ifDefined(this.href)}"
					rel="noreferrer noopener"
					target="_blank"
					role="button"
					tabindex="0"
				>
					${AttachmentDownloadButton()}
				</a>
			</div>
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-file-attachment': DiscordFileAttachment;
	}
}
