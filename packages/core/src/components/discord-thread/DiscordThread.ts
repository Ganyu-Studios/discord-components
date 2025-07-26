import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LightTheme } from '../../types.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

@customElement('discord-thread')
export class DiscordThread extends LitElement implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			border-radius: 4px;
			cursor: pointer;
			margin-top: 8px;
			max-width: 480px;
			min-width: 0;
			padding: 8px;
			display: inline-flex;
			width: fit-content;
			flex-direction: column;
			background-color: var(--background, #393a41);
			border: 1px solid var(--border, #44454c);
		}

		:host([light-theme]) {
			--background: color-mix(in oklab, hsl(0 calc(1 * 0%) 100% /1) 100%, #000 0%);
			--border: color-mix(in oklab, hsl(240 calc(1 * 4%) 60.784% /0.2784313725490196) 100%, hsl(0 0% 0% /0.2784313725490196) 0%);
		}

		:host .discord-thread-top {
			display: flex;
		}

		:host .discord-thread-bottom {
			font-size: 0.875rem;
			line-height: 1.125rem;
			align-items: center;
			color: #b9bbbe;
			display: flex;
			margin-top: 2px;
			white-space: nowrap;
		}

		:host([light-theme]) .discord-thread-bottom {
			color: #4f5660;
		}

		:host .discord-thread-name {
			font-size: 0.875rem;
			font-weight: 600;
			line-height: 1.125rem;
			color: white;
			margin-right: 8px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		:host .discord-thread-cta {
			color: var(--color, color-mix(in oklab, hsl(213.934 calc(1 * 85.915%) 72.157% /1) 100%, #000 0%));
			flex-shrink: 0;
			font-size: 0.875rem;
			font-weight: 600;
			line-height: 1.125rem;
		}

		:host([light-theme]) {
			.discord-thread-name {
				color: #060607;
			}
			.discord-thread-cta {
				--color: #0074e3;
			}
		}

		:host .discord-thread-cta:hover {
			text-decoration: underline;
		}

		.discord-thread:hover .discord-thread-cta {
			text-decoration: underline;
		}
	`;

	/**
	 * The name of the thread.
	 */
	@property()
	public accessor name = 'Thread';

	/**
	 * The the text within the call to action text. (i.e. 'See Thread' or 'x Messages')
	 */
	@property()
	public accessor cta = 'See Thread';

	@consume({ context: messagesLightTheme })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public accessor lightTheme = false;

	protected override render() {
		return html`
			<div class="discord-thread-top">
				<span class="discord-thread-name">${this.name}</span>
				<span class="discord-thread-cta" aria-hidden="true"> ${this.cta} › </span>
			</div>
			<span class="discord-thread-bottom">
				<slot></slot>
			</span>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-thread': DiscordThread;
	}
}
