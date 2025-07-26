import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { LightTheme } from '../../types.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

@customElement('discord-code')
export class DiscordCode extends LitElement implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			white-space: break-spaces;
			font-family:
				Consolas,
				Andale Mono WT,
				Andale Mono,
				Lucida Console,
				Lucida Sans Typewriter,
				DejaVu Sans Mono,
				Bitstream Vera Sans Mono,
				Liberation Mono,
				Nimbus Mono L,
				Monaco,
				Courier New,
				Courier,
				monospace;
			border-radius: 3px;
			font-size: 85%;
		}

		code {
			padding: 0.2em;
			margin: -0.2em;
			border-radius: 3px;
			border: none;
			text-indent: 0;
			white-space: pre-wrap;
			background-color: var(
				--background-color,
				color-mix(in oklab, hsl(234.935 calc(1 * 85.556%) 64.706% /0.0784313725490196) 100%, hsl(0 0% 0% /0.0784313725490196) 0%)
			);

			border: var(--border, 1px solid color-mix(in oklab, hsl(240 calc(1 * 4%) 60.784% /0.2) 100%, hsl(0 0% 0% /0.2) 0%));
		}

		:host([multiline]) code {
			display: block;
			width: 90%;
			font-size: 0.875rem;
			line-height: 1.125rem;
			padding: 0.5em;
		}

		:host([embed]) code {
			background-color: #1e1f22;
		}

		:host([embed][multiline]) code {
			display: block;
			width: 100%;
			padding: 7px;
			border-radius: 4px;
			background: #1e1f22;
		}

		:host([light-theme]) {
			--border: 1px solid #d3d4da;
			--background-color: #f4f5fa;
		}

		:host([light-theme][embed]) code {
			background-color: #e3e5e8;
		}
	`;

	/**
	 * Whether this code block is a multi-line code block
	 */
	@property({ type: Boolean, reflect: true })
	public accessor multiline = false;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public accessor lightTheme = false;

	/**
	 * Whether this code block exists within a `discord-embed` component.
	 */
	@property({ type: Boolean, reflect: true })
	public accessor embed = false;

	protected override render() {
		if (this.multiline) {
			return html`<discord-pre ?embed=${this.embed}
				><code
					class=${classMap({
						'is-in-embed': this.isInEmbed
					})}
					><slot></slot></code
			></discord-pre>`;
		}

		return html`<code><slot></slot></code>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-code': DiscordCode;
	}
}
