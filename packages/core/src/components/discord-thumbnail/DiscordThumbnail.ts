/* eslint-disable lit-a11y/click-events-have-key-events */
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../discord-custom-emoji/DiscordCustomEmoji.js';
import { DiscordMediaSpoileableCover } from '../discord-media-spoileable-cover/DiscordMediaSpoileableCover.js';

@customElement('discord-thumbnail')
export class DiscordThumbnail extends LitElement {
	/**
	 * @internal
	 */
	public static override readonly styles = [
		css`
			:host {
				display: inline-block;
				width: 85px;
				height: 85px;
				border-radius: 8px;
				overflow: hidden;
			}
			img {
				cursor: pointer;
			}
		`,
		DiscordMediaSpoileableCover.hostStyles
	];

	@property({ type: String })
	public media: string;

	@property({ type: String })
	public description: string;

	@property({ type: Boolean, reflect: true })
	public spoiler = false;

	@state()
	private isOpen = false;

	protected override render() {
		return html`
			${DiscordMediaSpoileableCover.inject(this.spoiler)}
			<img src=${this.media} alt="Thumbnail" width="85" height="85" draggable="false" @click=${() => (this.isOpen = true)} />
			<discord-media-fullscreen-previewer
				@close-full-screen=${() => (this.isOpen = false)}
				.currentSlot=${0}
				.isOpen=${this.isOpen}
				.mediaItems=${[{ height: 85, media: this.media, mimeType: 'image', width: 85 }]}
			></discord-media-fullscreen-previewer>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-thumbnail': DiscordThumbnail;
	}
}
