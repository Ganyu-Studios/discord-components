import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import '../discord-custom-emoji/DiscordCustomEmoji.js';

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

	/**
	 * Whether a line is drawn, as in Discord's `divider` field. It defaults to `true`, so a
	 * plain boolean attribute could never turn it off: `divider="false"` does.
	 */
	@property({
		converter: {
			fromAttribute: (value) => value !== 'false',
			toAttribute: (value: boolean) => (value ? '' : 'false')
		}
	})
	public divider = true;

	@property({ type: Number, reflect: true })
	public spacing: 1 | 2 = 1;

	protected override render() {
		return html` ${when(this.divider, () => html`<div class="discord-divider-hr"></div>`)} `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-separator': DiscordSeparator;
	}
}
