import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../discord-custom-emoji/DiscordCustomEmoji.js';
import { DiscordMediaSpoileableCover } from '../discord-media-spoileable-cover/DiscordMediaSpoileableCover.js';

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
				border-radius: 2px;
				overflow: hidden;
				position: relative;

				--img-width: 100%;
				--img-height: 100%;
				--img-max-width: unset;
				--img-max-height: unset;

				img {
					width: var(--img-width);
					height: var(--img-height);
					max-width: var(--img-max-width);
					max-height: var(--img-max-height);
					object-fit: cover;
				}
			}

			:host([is-one-only='true']) {
				width: unset;
				height: unset;
				border-radius: 8px;
				max-width: min(100%, 600px);
				img {
					width: auto;
					height: auto;
					max-width: 100%;
					max-height: 350px;
				}
			}
		`,
		DiscordMediaSpoileableCover.hostStyles
	];

	@property({ type: String })
	public accessor media: string;

	@property({ type: String })
	public accessor description: string;

	@property({ attribute: 'real-size' })
	public accessor realSize: string;

	@property({ type: Boolean })
	public accessor spoiler = false;

	protected override render() {
		return html`
			${DiscordMediaSpoileableCover.inject(this.spoiler)}
			<img src=${this.media} alt=${this.description} />
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-media-gallery-item': DiscordMediaGalleryItem;
	}
}
