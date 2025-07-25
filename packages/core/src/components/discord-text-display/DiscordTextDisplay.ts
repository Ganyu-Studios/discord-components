import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../discord-custom-emoji/DiscordCustomEmoji.js';

@customElement('discord-text-display')
export class DiscordTextDisplay extends LitElement {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			display: flex;
			flex: 1;
			flex-direction: column;
			row-gap: 4px;
			font-size: 14px;
			font-family: 'gg sans', 'Noto Sans', Whitney, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;
			justify-content: var(--justify-content, flex-start);
		}
	`;

	protected override render() {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-text-display': DiscordTextDisplay;
	}
}
