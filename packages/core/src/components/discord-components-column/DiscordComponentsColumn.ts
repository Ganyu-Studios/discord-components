import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('discord-components-column')
export class DiscordComponentsColumn extends LitElement {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			display: flex;
			flex-direction: column;
			row-gap: 8px;
		}

		::slotted(discord-file-attachment) {
			--media-item-container-margin-top: 0px;
			padding-top: 0px;
			padding-bottom: 0px;
		}
	`;

	protected override render() {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-components-column': DiscordComponentsColumn;
	}
}
