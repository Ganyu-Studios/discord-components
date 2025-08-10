import { consume } from '@lit/context';
import { html, LitElement, type TemplateResult, css } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import type { LightTheme } from '../../types.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';
import type { DiscordStringSelectMenu } from '../discord-string-select-menu/DiscordStringSelectMenu.js';
import VerifiedTick from '../svgs/VerifiedTick.js';

export abstract class BaseDiscordSelectMenuOption extends LitElement implements LightTheme {
	@consume({ context: messagesLightTheme })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public lightTheme = false;

	@property({ type: Boolean, reflect: true, attribute: 'selected' })
	public selected = false;

	public static baseStyles = css`
		label {
			display: flex;
			align-items: center;
			max-width: 400px;
			padding: 12px 8px 8px 12px;
			gap: 10px;
			font-size: small;
			cursor: pointer;
		}

		:host {
			user-select: none;
		}

		label:hover,
		:host([selected]) label {
			background-color: rgba(255, 255, 255, 0.1);
		}

		:host([light-theme]) {
			background-color: #f2f3f5 !important;
			border-color: #d9d9d9 !important;
			color: #2e3338;
			span {
				color: #434c4f;
			}
		}

		:host([light-theme]) label:hover,
		:host([selected][light-theme]) label {
			background-color: rgba(204, 204, 204, 2) !important;
		}

		.selected-tick {
			width: 20px;
			height: 20px;
			border-radius: 50%;
			background-color: #5865f2;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;

			svg {
				width: 32px;
				height: 32px;
			}
		}

		.flex-container {
			flex: 1;
			display: flex;
			align-items: center;
			gap: 4px;
			justify-content: space-between;
		}

		:host([slot='default']) {
			pointer-events: none;
			background-color: transparent !important;
			border-color: transparent !important;
			label {
				padding-left: 4px !important;
			}
		}

		:host(:not([visible])) {
			display: none;
		}
	`;

	protected renderSelectedContainer(content: TemplateResult) {
		return html`
			<div class="flex-container">${content} ${when(this.selected, () => html`<div class="selected-tick">${VerifiedTick()}</div>`)}</div>
		`;
	}

	@property({ type: Boolean, reflect: true, attribute: 'visible' })
	public visible = true;

	public abstract filter(searchValue: Lowercase<string>): boolean;

	public selectOption() {
		if (this.slot === 'default') return;
		const parent = this.parentElement as DiscordStringSelectMenu | undefined;
		if (!parent) return;
		parent.selectOption(this);
	}
}
