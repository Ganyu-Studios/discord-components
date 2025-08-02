import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { discordContainerContext } from '../discord-container/DiscordContainer.js';
import { forwardedMessageContext } from '../discord-forwarded-message/DiscordForwardedMessage.js';

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
			margin-top: 8px;
		}

		::slotted(discord-file-attachment) {
			--media-item-container-margin-top: 0px;
			padding-top: 0px;
			padding-bottom: 0px;
		}

		:host([is-in-container]),
		:host([is-in-forwarded-message]) {
			margin-top: 0px;
		}
	`;

	@consume({ context: discordContainerContext, subscribe: true })
	@property({ type: Boolean, attribute: 'is-in-container', reflect: true })
	public isInContainer = false;

	@consume({ context: forwardedMessageContext, subscribe: true })
	@property({ type: Boolean, attribute: 'is-in-forwarded-message', reflect: true })
	public isInForwardedMessage = false;

	protected override render() {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-components-column': DiscordComponentsColumn;
	}
}
