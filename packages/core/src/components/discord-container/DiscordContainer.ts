import { consume, createContext, provide } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import '../discord-custom-emoji/DiscordCustomEmoji.js';
import { when } from 'lit/directives/when.js';
import type { LightTheme } from '../../types.js';
import { DiscordMediaSpoileableCover } from '../discord-media-spoileable-cover/DiscordMediaSpoileableCover.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

export const discordContainerContext = createContext<boolean>('is-in-container');

@customElement('discord-container')
export class DiscordContainer extends LitElement implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = [
		css`
			:host {
				color: #dcddde;
				display: flex;
				font-size: 13px;
				line-height: 150%;
				margin-bottom: 8px;
				margin-top: 8px;
				width: 4px;
				max-width: 600px;
				overflow: hidden;
				display: flex;
				background-color: var(--background, #393a41);
				border: 1px solid var(--border, #44454c);
				border-radius: 8px;
				width: fit-content;
			}

			.discord-left-border {
				width: 4px;
			}

			:host([light-theme]) {
				color: #2e3338;
				--background: color-mix(in oklab, hsl(0 calc(1 * 0%) 100% /1) 100%, #000 0%);
				--border: color-mix(in oklab, hsl(240 calc(1 * 4%) 60.784% /0.2784313725490196) 100%, hsl(0 0% 0% /0.2784313725490196) 0%);
			}

			discord-components-column {
				padding: 16px;
			}

			.discord-container-custom-emoji {
				display: inline-block;
			}

			.discord-container-custom-emoji .discord-container-custom-emoji-image {
				width: 18px;
				height: 18px;
				vertical-align: bottom;
			}
		`,
		DiscordMediaSpoileableCover.hostStyles
	];

	/**
	 * The color to use for the container's left border.
	 * Can be any [CSS color value](https://www.w3schools.com/cssref/css_colors_legal.asp).
	 */
	@property({ type: String, reflect: true, attribute: 'accent-color' })
	public accessor accentColor: string;

	@provide({ context: discordContainerContext })
	public accessor isInContainer = true;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public accessor lightTheme = false;

	@property({ type: Boolean, reflect: true })
	public accessor spoiler = false;

	protected override render() {
		return html`
			${DiscordMediaSpoileableCover.inject(this.spoiler)}
			${when(this.accentColor, () => html`<div style=${styleMap({ 'background-color': this.accentColor })} class="discord-left-border"></div>`)}
			<discord-components-column>
				<slot></slot>
			</discord-components-column>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-container': DiscordContainer;
	}
}
