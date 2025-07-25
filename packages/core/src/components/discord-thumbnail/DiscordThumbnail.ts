import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
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
		`,
		DiscordMediaSpoileableCover.hostStyles
	];

	@property({ type: String })
	public accessor media: string;

	@property({ type: String })
	public accessor description: string;

	@property({ type: Boolean, reflect: true })
	public accessor spoiler = false;

	protected override render() {
		return html`
			${DiscordMediaSpoileableCover.inject(this.spoiler)}
			<a href=${this.media} target="_blank" rel="noopener noreferrer">
				<img src=${this.media} alt="Thumbnail" width="85" height="85" />
			</a>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-thumbnail': DiscordThumbnail;
	}
}
