/**
 * this file is based on
 * https://github.com/ItzDerock/discord-components/tree/main/packages/core/src/components/discord-header
 */

import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

@customElement('discord-transcript-header')
export class DiscordTranscriptHeader extends LitElement {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			display: flex;
			flex-direction: row;
			align-items: flex-start;
			/* Grows with the text: a fixed height let the description spill below the border on
			   narrow screens. */
			min-height: 5rem;
			padding: 0.5rem;
			gap: 0.5rem;
			border-bottom: 1px solid rgba(79, 84, 92, 0.48);
			padding-bottom: 1rem !important;
		}

		.discord-header-icon {
			flex-shrink: 0;
			width: 5rem;
			height: 5rem;
		}

		.discord-header-icon > div {
			background-color: rgb(79, 84, 92);
			border-radius: 50%;
			width: 5rem;
			height: 5rem;
			text-align: center;
			align-items: center;
			justify-content: center;
			display: flex;
			font-size: xx-large;
		}

		.discord-header-icon > img {
			border-radius: 50%;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.discord-header-text {
			flex-grow: 1;
			min-width: 0;
			overflow-wrap: anywhere;
		}

		.discord-header-text-guild {
			font-size: 1.5rem;
			font-weight: bold;
		}

		/* Last, so it wins over the rules above on small screens. */
		@media (max-width: 480px) {
			:host {
				min-height: 3.5rem;
			}

			.discord-header-icon,
			.discord-header-icon > div {
				width: 3.5rem;
				height: 3.5rem;
				font-size: x-large;
			}

			.discord-header-text-guild {
				font-size: 1.25rem;
			}
		}
	`;

	/**
	 * The guild name
	 */
	@property({ type: String, reflect: true })
	public guild: string;

	/**
	 * The name of the channel
	 */
	@property({ type: String, reflect: true })
	public channel: string;

	/**
	 * The icon to display.
	 */
	@property({ type: String, reflect: true })
	public icon?: string;

	public getLettersName() {
		const split = this.guild.split(' ');
		return split.length > 1 ? split[0][0] + split[1][0] : split[0][0];
	}

	protected override render() {
		return html`<div class="discord-header-icon">
				${when(
					this.icon,
					() => html`<img src="${this.icon!}" alt="guild icon" />`,
					() =>
						html`<div>
							<span> ${this.getLettersName()} </span>
						</div>`
				)}
			</div>
			<div class="discord-header-text">
				<div class="discord-header-text-guild">${this.guild}</div>
				<div class="discord-header-text-channel">#${this.channel}</div>
				<slot></slot>
			</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-transcript-header': DiscordTranscriptHeader;
	}
}
