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

		/* One block for all the slotted content, so text, formatting and emojis flow inline as they
		   do in a message instead of each becoming its own flex row. */
		.discord-text-display-content {
			display: block;
			min-width: 0;
			overflow-wrap: anywhere;
		}
	`;

	protected override render() {
		return html`<div class="discord-text-display-content"><slot></slot></div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-text-display': DiscordTextDisplay;
	}
}
