/* eslint-disable lit-a11y/click-events-have-key-events */
import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { type OpenInFullScreenEventDetail } from '../_private/mediaGalleryFullScreenContext.js';
import '../discord-custom-emoji/DiscordCustomEmoji.js';
import { mediaItemsContext } from '../discord-media-gallery/DiscordMediaGallery.js';
import { DiscordMediaSpoileableCover } from '../discord-media-spoileable-cover/DiscordMediaSpoileableCover.js';
import MediaPlayIcon from '../svgs/MediaPlayIcon.js';

@customElement('discord-media-gallery-item')
export class DiscordMediaGalleryItem extends LitElement {
	/**
	 * @internal
	 */
	public static override readonly styles = [
		css`
			:host {
				display: inline-flex;
				flex: auto;
				height: 100%;
				width: 100%;
				overflow: hidden;
				position: relative;

				--img-width: 100%;
				--img-height: 100%;
				--img-max-width: unset;
				--img-max-height: unset;

				img,
				video {
					border-radius: 2px;
					width: var(--img-width);
					height: var(--img-height);
					max-width: var(--img-max-width);
					max-height: var(--img-max-height);
					object-fit: cover;
					cursor: pointer;
				}

				.discord-media-gallery-video-container {
					max-width: 100%;
					max-height: 100%;
					position: relative;
					cursor: pointer;

					.discord-media-attachment-control-icon {
						position: absolute;
						top: 50%;
						left: 50%;
						width: 24px;
						height: 24px;
						background-color: hsl(0 calc(1 * 0%) 0% /1);
						color: hsl(0 calc(1 * 0%) 100% /1);
						padding: 12px;
						border-radius: 50%;
						transform: translate(-50%, -50%);
						opacity: 0.6;
						transition: opacity 0.25s;
					}

					&:hover .discord-media-attachment-control-icon {
						opacity: 0.8;
					}
				}
			}

			:host([is-one-only='true']) {
				width: unset;
				height: unset;
				border-radius: 8px;
				max-width: min(100%, 600px);

				img,
				video {
					width: auto;
					height: auto;
					max-width: 100%;
					max-height: 350px;
				}
			}

			.discord-media-gallery-item-gif {
				line-height: 16px;
				position: absolute;
				top: 6px;
				left: 6px;
				font-weight: bold;
				color: white;
				font-size: 13px;
				background-color: rgba(0, 0, 0, 0.65);
				padding: 4px 4px;
				border-radius: 4px;
			}
		`,
		DiscordMediaSpoileableCover.hostStyles
	];

	@property({ type: String })
	public media: string;

	@property({ type: String, attribute: 'mime-type' })
	public mimeType?: string;

	@property({ type: String })
	public description: string;

	@property({ attribute: 'real-size' })
	public realSize: string;

	@property({ type: Boolean })
	public spoiler = false;

	@property({ type: Number })
	public width?: number;

	@property({ type: Number })
	public height?: number;

	public static discordSupportedVideoExtensions = new Set(['mp4', 'webm', 'mov', 'avi', 'mkv', 'wmv', 'flv']);

	public static discordSupportedVideoMimeTypes = new Set([
		'video/mp4',
		'video/webm',
		'video/quicktime',
		'video/x-msvideo',
		'video/x-ms-wmv',
		'video/x-flv'
	]);

	public static isVideo(url: string, mimeType?: string | null) {
		if (mimeType && DiscordMediaGalleryItem.discordSupportedVideoMimeTypes.has(mimeType)) return true;
		const extension = url.split('.').pop() as string;
		return DiscordMediaGalleryItem.discordSupportedVideoExtensions.has(extension);
	}

	public static isGif(url: string, mimeType?: string | null) {
		if (url.endsWith('.gif')) return true;
		return mimeType === 'image/gif';
	}

	@consume({ context: mediaItemsContext, subscribe: true })
	public mediaItems: DiscordMediaGalleryItem[];

	public openInFullScreen() {
		const slot = this.getAttribute('slot');
		if (!slot) return;
		const position = slot.split('-')[1];
		if (!position) return;
		const numberPosition = Number(position);
		if (Number.isNaN(numberPosition)) return;

		const event = new CustomEvent<OpenInFullScreenEventDetail>('open-in-full-screen', {
			detail: {
				slot: numberPosition - 1
			},
			bubbles: true
		});

		this.dispatchEvent(event);
	}

	protected override render() {
		const isVideo = DiscordMediaGalleryItem.isVideo(this.media, this.mimeType);

		const isOnlyOne = this.mediaItems.length === 1;

		if (isOnlyOne && isVideo) {
			return html`<discord-video-attachment
				href=${this.media}
				spoiler=${this.spoiler}
				description=${this.description}
				class="no-top-margin"
				width=${ifDefined(this.width)}
				height=${ifDefined(this.height)}
			></discord-video-attachment>`;
		}

		return html`
			${DiscordMediaSpoileableCover.inject(this.spoiler)}
			${when(
				isVideo,
				() => html`
					<div class="discord-media-gallery-video-container" @click=${this.openInFullScreen}>
						<video src=${this.media} alt=${this.description ?? this.media}></video>
						${MediaPlayIcon({ class: 'discord-media-attachment-control-icon' })}
					</div>
				`,
				() => html`
					${when(DiscordMediaGalleryItem.isGif(this.media), () => html` <div class="discord-media-gallery-item-gif">GIF</div> `)}
					<img src=${this.media} alt=${this.description ?? this.media} @click=${this.openInFullScreen} />
				`
			)}
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-media-gallery-item': DiscordMediaGalleryItem;
	}
}
