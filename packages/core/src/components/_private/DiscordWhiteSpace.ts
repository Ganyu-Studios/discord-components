import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('discord-white-space')
export class DiscordCode extends LitElement {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		::slotted(*) {
			white-space: var(--discord-white-space, pre);
		}
	`;

	protected override render() {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-white-space': DiscordCode;
	}
}
