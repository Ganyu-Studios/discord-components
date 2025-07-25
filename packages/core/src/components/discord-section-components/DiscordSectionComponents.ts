import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '../discord-custom-emoji/DiscordCustomEmoji.js';
import { discordSectionWithButton } from '../discord-section/DiscordSection.js';

@customElement('discord-section-components')
export class DiscordSectionComponents extends LitElement {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			display: flex;
			flex-direction: column;
			flex: 1;
			row-gap: 8px;
		}

		slot.has-only-one-text-display-child::slotted(discord-text-display) {
			--justify-content: center;
		}
	`;

	@consume({ context: discordSectionWithButton, subscribe: true })
	@property({ type: Boolean, attribute: false })
	public accessor withButton = false;

	@property({ type: Boolean, attribute: false })
	public accessor hasOnlyOneTextDisplayChild = false;

	protected calcHasOnlyOneTextDisplayChild() {
		if (!this.withButton) return (this.hasOnlyOneTextDisplayChild = false);
		const children = this.children.length;
		if (children !== 1) return (this.hasOnlyOneTextDisplayChild = false);
		const hasTextDisplay = this.querySelector('discord-text-display');
		this.hasOnlyOneTextDisplayChild = Boolean(hasTextDisplay);
		return undefined;
	}

	protected override render() {
		return html`<slot
			@slotchange=${this.calcHasOnlyOneTextDisplayChild}
			class=${classMap({
				'has-only-one-text-display-child': this.hasOnlyOneTextDisplayChild
			})}
		></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-section-components': DiscordSectionComponents;
	}
}
