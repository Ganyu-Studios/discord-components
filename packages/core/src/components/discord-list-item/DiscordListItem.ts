import { css, html, isServer, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { DiscordComponentsError } from '../../util.js';

@customElement('discord-list-item')
export class DiscordListItem extends LitElement {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host > li {
			margin-bottom: 4px;
		}
	`;

	public checkParentElement() {
		// the parent is only known on the client; skip the structural validation during SSR.
		if (isServer) return;

		if (
			this.parentElement?.tagName.toLowerCase() !== 'discord-unordered-list' &&
			this.parentElement?.tagName.toLowerCase() !== 'discord-ordered-list'
		) {
			throw new DiscordComponentsError(
				'All <discord-list-item> components must be direct children of <discord-unordered-list> or <discord-ordered-list>.'
			);
		}
	}

	protected override render() {
		this.checkParentElement();
		return html`<li><slot></slot></li>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-list-item': DiscordListItem;
	}
}
