import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LightTheme } from '../../types.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

@customElement('discord-embed-description')
export class DiscordEmbedDescription extends LitElement implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			font-size: 0.875rem;
			font-weight: 400;
			grid-column: 1/1;
			line-height: 1.125rem;
			margin-top: 8px;
			min-width: 0;
			max-width: 400px;
		}

		::slotted(discord-code) {
			--discord-code-background-color: color-mix(in oklab, hsl(230 calc(1 * 6.383%) 18.431% /1) 100%, #000 0%);
			--discord-code-border: none;
		}

		:host([light-theme]) {
			::slotted(discord-code) {
				--background-color: #f3f3f4;
			}
		}

		slot::slotted(discord-header:first-child) {
			--margin-top: 0px;
		}
	`;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public lightTheme = false;

	protected override render() {
		return html` <discord-white-space><slot></slot></discord-white-space>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-embed-description': DiscordEmbedDescription;
	}
}
