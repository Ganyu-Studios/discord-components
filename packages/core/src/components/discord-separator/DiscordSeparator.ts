import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../discord-custom-emoji/DiscordCustomEmoji.js';
import { when } from 'lit/directives/when.js';

@customElement('discord-separator')
export class DiscordSeparator extends LitElement {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		.discord-divider-hr {
			display: block;
			border-bottom: 1px solid #4c4c54;
		}

		:host([spacing='2']) {
			margin: 8px 0px;
		}
	`;

	@property({ type: Boolean })
	public accessor divider = true;

	@property({ type: Number, reflect: true })
	public accessor spacing: 1 | 2 = 1;

	protected override render() {
		return html` ${when(this.divider, () => html`<div class="discord-divider-hr"></div>`)} `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-separator': DiscordSeparator;
	}
}
