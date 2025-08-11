import { css, html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseDiscordSelectMenuOption } from '../_private/BaseDiscordSelectMenuOption.js';

export const channelIcon: Record<number | string, { normal: TemplateResult; private?: TemplateResult }> = {
	'0': {
		// Guild Text
		normal: html`
			<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					fill-rule="evenodd"
					d="M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.97.32L8.85 16h4.97l-.8 4.84a1 1 0 0 0 1.97.32l.86-5.16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.97-.32L15.15 8h-4.97l.8-4.84ZM14.15 14l.67-4H9.85l-.67 4h4.97Z"
					clip-rule="evenodd"
					class=""
				></path>
			</svg>
		`,
		private: html`
			<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					fill-rule="evenodd"
					d="M16 4h.5v-.5a2.5 2.5 0 0 1 5 0V4h.5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm4-.5V4h-2v-.5a1 1 0 1 1 2 0Z"
					clip-rule="evenodd"
					class=""
				></path>
				<path
					fill="currentColor"
					d="M12.5 8c.28 0 .5.22.5.5V9c0 .1 0 .2.02.31.03.34-.21.69-.56.69H9.85l-.67 4h4.97l.28-1.68c.06-.34.44-.52.77-.43a3 3 0 0 0 .8.11c.27 0 .47.24.43.5l-.25 1.5H20a1 1 0 1 1 0 2h-4.15l-.86 5.16a1 1 0 0 1-1.98-.32l.8-4.84H8.86l-.86 5.16A1 1 0 0 1 6 20.84L6.82 16H3a1 1 0 1 1 0-2h4.15l.67-4H4a1 1 0 1 1 0-2h4.15l.86-5.16a1 1 0 1 1 1.98.32L10.19 8h2.31Z"
					class=""
				></path>
			</svg>
		`
	},
	'2': {
		// Guild Voice
		normal: html`<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M12 3a1 1 0 0 0-1-1h-.06a1 1 0 0 0-.74.32L5.92 7H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.92l4.28 4.68a1 1 0 0 0 .74.32H11a1 1 0 0 0 1-1V3ZM15.1 20.75c-.58.14-1.1-.33-1.1-.92v-.03c0-.5.37-.92.85-1.05a7 7 0 0 0 0-13.5A1.11 1.11 0 0 1 14 4.2v-.03c0-.6.52-1.06 1.1-.92a9 9 0 0 1 0 17.5Z"
				class=""
			></path>
			<path
				fill="currentColor"
				d="M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z"
				class=""
			></path>
		</svg>`,
		private: html`
			<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					fill-rule="evenodd"
					d="M16 4h.5v-.5a2.5 2.5 0 0 1 5 0V4h.5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm4-.5V4h-2v-.5a1 1 0 1 1 2 0Z"
					clip-rule="evenodd"
					class=""
				></path>
				<path
					fill="currentColor"
					d="M11 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1h-.06a1 1 0 0 1-.74-.32L5.92 17H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2.92l4.28-4.68a1 1 0 0 1 .74-.32H11ZM20.5 12c-.28 0-.5.22-.52.5a7 7 0 0 1-5.13 6.25c-.48.13-.85.55-.85 1.05v.03c0 .6.52 1.06 1.1.92a9 9 0 0 0 6.89-8.25.48.48 0 0 0-.49-.5h-1ZM16.5 12c-.28 0-.5.23-.54.5a3 3 0 0 1-1.33 2.02c-.35.23-.63.6-.63 1.02v.14c0 .63.59 1.1 1.16.83a5 5 0 0 0 2.82-4.01c.02-.28-.2-.5-.48-.5h-1Z"
					class=""
				></path>
			</svg>
		`
	},
	'4': {
		// Guild Category
		normal: html`<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M2 5a3 3 0 0 1 3-3h3.93a2 2 0 0 1 1.66.9L12 5h7a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5Z"
				class=""
			></path>
		</svg>`
	},
	'5': {
		// Guild Announcement
		normal: html`
			<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					fill-rule="evenodd"
					d="M19.56 2a3 3 0 0 0-2.46 1.28 3.85 3.85 0 0 1-1.86 1.42l-8.9 3.18a.5.5 0 0 0-.34.47v10.09a3 3 0 0 0 2.27 2.9l.62.16c1.57.4 3.15-.56 3.55-2.12a.92.92 0 0 1 1.23-.63l2.36.94c.42.27.79.62 1.07 1.03A3 3 0 0 0 19.56 22h.94c.83 0 1.5-.67 1.5-1.5v-17c0-.83-.67-1.5-1.5-1.5h-.94Zm-8.53 15.8L8 16.7v1.73a1 1 0 0 0 .76.97l.62.15c.5.13 1-.17 1.12-.67.1-.41.29-.78.53-1.1Z"
					clip-rule="evenodd"
					class=""
				></path>
				<path fill="currentColor" d="M2 10c0-1.1.9-2 2-2h.5c.28 0 .5.22.5.5v7a.5.5 0 0 1-.5.5H4a2 2 0 0 1-2-2v-4Z" class=""></path>
			</svg>
		`
	},
	'15': {
		// Guild Forum
		normal: html`<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M18.91 12.98a5.45 5.45 0 0 1 2.18 6.2c-.1.33-.09.68.1.96l.83 1.32a1 1 0 0 1-.84 1.54h-5.5A5.6 5.6 0 0 1 10 17.5a5.6 5.6 0 0 1 5.68-5.5c1.2 0 2.32.36 3.23.98Z"
				class=""
			></path>
			<path
				fill="currentColor"
				d="M19.24 10.86c.32.16.72-.02.74-.38L20 10c0-4.42-4.03-8-9-8s-9 3.58-9 8c0 1.5.47 2.91 1.28 4.11.14.21.12.49-.06.67l-1.51 1.51A1 1 0 0 0 2.4 18h5.1a.5.5 0 0 0 .49-.5c0-4.2 3.5-7.5 7.68-7.5 1.28 0 2.5.3 3.56.86Z"
				class=""
			></path>
		</svg>`
	},
	'16': {
		// Guild Media
		normal: html`<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 64 64">
			<path
				fill="currentColor"
				d="M56 50.6667V13.3333C56 10.4 53.6 8 50.6667 8H13.3333C10.4 8 8 10.4 8 13.3333V50.6667C8 53.6 10.4 56 13.3333 56H50.6667C53.6 56 56 53.6 56 50.6667ZM22.6667 36L29.3333 44.0267L38.6667 32L50.6667 48H13.3333L22.6667 36Z"
			/>
		</svg>`
	}
};

export interface ChannelSelectMenuOptionData {
	identifier: string;
	name: string;
	type: number;
}

@customElement('discord-channel-select-menu-option')
export class DiscordChannelSelectMenuOption extends BaseDiscordSelectMenuOption implements ChannelSelectMenuOptionData {
	/**
	 * @internal
	 */
	public static override readonly styles = [
		css`
			img {
				margin-right: 4px;
				vertical-align: bottom;
				object-fit: contain;
			}

			.discord-string-select-menu-option-ellipsis-text {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				display: flex;
				align-items: center;
				gap: 4px;
				font-size: 16px;
			}

			strong {
				font-weight: 600;
			}

			.discord-string-select-menu-option-hidden {
				display: none;
			}

			discord-verified-author-tag {
				font-size: 12px;
				font-weight: 600;
			}

			.role-icon {
				fill: var(--role-color);
				& > path {
					fill: var(--role-color);
				}
			}
		`,
		BaseDiscordSelectMenuOption.baseStyles
	];

	@property({ type: String, reflect: true })
	public identifier: string;

	@property({ reflect: true, attribute: 'name' })
	public name: string;

	@property({ type: Number, reflect: true, attribute: 'type' })
	public type: number;

	@property({ type: Boolean, reflect: true, attribute: 'is-private' })
	public isPrivate = false;

	public filter(searchValue: string) {
		return this.name.toLowerCase().includes(searchValue);
	}

	protected override render() {
		const defaultIcon = channelIcon[0];

		const icon = this.isPrivate ? (channelIcon[this.type].private ?? defaultIcon.private) : (channelIcon[this.type].normal ?? defaultIcon.normal);

		return html`
			<label>
				${icon}
				${this.renderSelectedContainer(
					html`<div class="discord-string-select-menu-option-ellipsis-text">
						<div class="discord-string-select-menu-option-ellipsis-text">
							<span>${this.name}</span>
						</div>
					</div>`
				)}

				<span class="discord-string-select-menu-option-hidden"><input type="checkbox" @click=${this.selectOption} /></span>
			</label>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-channel-select-menu-option': DiscordChannelSelectMenuOption;
	}
}
