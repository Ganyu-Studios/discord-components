import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { LightTheme } from '../../types.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

@customElement('discord-link')
export class DiscordLink extends LitElement implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		a {
			color: var(--color, color-mix(in oklab, hsl(213.934 calc(1 * 85.915%) 72.157% /1) 100%, #000 0%));
			text-decoration: none;
		}
		a.discord-link-light-theme {
			--color: #0074e3;
		}

		a:hover {
			text-decoration: underline;
		}
	`;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public lightTheme = false;

	/**
	 * The URL to link
	 *
	 * @example
	 * ```ts
	 * 'https://example.com/example.txt'
	 * ```
	 */
	@property()
	public href: string;

	/**
	 * The `<a>` tag {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#rel | `rel`}
	 */
	@property()
	public rel: string;

	/**
	 * The `<a>` tag {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target | `target`}
	 */
	@property()
	public target: '_blank' | '_parent' | '_self' | '_top';

	/**
	 * The `<a>` tag {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#type | `type`}
	 */
	@property()
	public type: string;

	protected override render() {
		return html`<a
			href=${ifDefined(this.href)}
			rel=${ifDefined(this.rel)}
			target=${ifDefined(this.target)}
			type=${ifDefined(this.type)}
			class=${classMap({ 'discord-link-light-theme': this.lightTheme })}
			><slot></slot
		></a>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-link': DiscordLink;
	}
}
