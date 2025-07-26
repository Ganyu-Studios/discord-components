import { createContext, provide } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../discord-custom-emoji/DiscordCustomEmoji.js';

export const discordSectionWithButton = createContext<boolean>('discord-section-with-button');

@customElement('discord-section')
export class DiscordSection extends LitElement {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			display: flex;
			gap: 12px;
			justify-content: space-between;
		}
	`;

	@provide({ context: discordSectionWithButton })
	public hasButton = false;

	protected override updated(): void {
		const hasButton = Boolean(this?.querySelector('discord-button'));
		this.hasButton = hasButton;
	}

	protected override render() {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-section': DiscordSection;
	}
}
