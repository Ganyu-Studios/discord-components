/* eslint-disable lit-a11y/click-events-have-key-events */
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../discord-custom-emoji/DiscordCustomEmoji.js';
import { when } from 'lit/directives/when.js';

@customElement('discord-media-spoileable-cover')
export class DiscordMediaSpoileableCover extends LitElement {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			--span-bg: hsl(0 calc(1 * 0%) 0% /0.6);
			display: contents;

			.spoiler-container {
				position: absolute;
				inset: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				z-index: 10;

				span {
					color: #fff;
					line-height: 15px;
					height: 15px;
					display: inline-block;
					background-color: var(--span-bg);
					border-radius: 20px;
					cursor: pointer;
					font-size: 13.5px;
					font-weight: 600;
					letter-spacing: 0.5px;
					padding: 8px 12px;
					z-index: 1;
				}
			}
		}
	`;

	public static hostStyles = css`
		:host:has(discord-media-spoileable-cover:not([is-revealed])) {
			position: relative;
			--bg: color-mix(in oklab, hsl(233.333 calc(1 * 3.529%) 50% /1) 100%, #000 0%);
			background-color: var(--bg);

			discord-media-spoileable-cover + * {
				filter: blur(44px);
			}
		}

		:host:has(discord-media-spoileable-cover[light-theme='true']:not([is-revealed])) {
			--bg: color-mix(in oklab, hsl(233.333 calc(1 * 4.225%) 58.235% /1) 100%, #000 0%);
			discord-media-spoileable-cover + * {
				opacity: 0;
			}
		}

		:host(:hover):has(discord-media-spoileable-cover:not([is-revealed])) {
			--bg: color-mix(in oklab, hsl(232.5 calc(1 * 4.167%) 62.353% /1) 100%, #000 0%);

			discord-media-spoileable-cover {
				--span-bg: hsl(0 calc(1 * 0%) 0% /0.8784313725490196);
			}
		}

		:host(:hover):has(discord-media-spoileable-cover[light-theme='true']:not([is-revealed])) {
			--bg: color-mix(in oklab, hsl(234 calc(1 * 4.274%) 45.882% /1) 100%, #000 0%);
		}
	`;

	@property({ type: Boolean, attribute: 'is-revealed', reflect: true })
	public accessor isRevealed = false;

	public handleReveal(_event: MouseEvent) {
		this.isRevealed = true;
	}

	public static inject(isSpoiler = false, lightTheme = false) {
		return html`${when(isSpoiler, () => html`<discord-media-spoileable-cover light-theme=${lightTheme}></discord-media-spoileable-cover>`)}`;
	}

	protected override render() {
		return html`
			${when(
				!this.isRevealed,
				() => html`
					<div class="spoiler-container" @click=${this.handleReveal}>
						<span>SPOILER</span>
					</div>
				`
			)}
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-media-spoileable-cover': DiscordMediaSpoileableCover;
	}
}
