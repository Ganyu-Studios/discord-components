import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import { BaseDiscordSelectMenuOption } from '../_private/BaseDiscordSelectMenuOption.js';

const roleCountIcon = html`
	<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM11.53 11A9.53 9.53 0 0 0 2 20.53c0 .81.66 1.47 1.47 1.47h.22c.24 0 .44-.17.5-.4.29-1.12.84-2.17 1.32-2.91.14-.21.43-.1.4.15l-.26 2.61c-.02.3.2.55.5.55h11.7a.5.5 0 0 0 .5-.55l-.27-2.6c-.02-.26.27-.37.41-.16.48.74 1.03 1.8 1.32 2.9.06.24.26.41.5.41h.22c.81 0 1.47-.66 1.47-1.47A9.53 9.53 0 0 0 12.47 11h-.94Z"
			class=""
		></path>
	</svg>
`;

const roleIcon = html`
	<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="role-icon">
		<path
			fill="currentColor"
			fill-rule="evenodd"
			d="M3.47 5.18c.27-.4.64-.74 1.1-.96l6.09-3.05a3 3 0 0 1 2.68 0l6.1 3.05A2.83 2.83 0 0 1 21 6.75v3.5a14.17 14.17 0 0 1-8.42 12.5c-.37.16-.79.16-1.16 0A14.18 14.18 0 0 1 3 9.77V6.75c0-.57.17-1.11.47-1.57Zm2.95 10.3A12.18 12.18 0 0 0 12 20.82a12.18 12.18 0 0 0 5.58-5.32A9.49 9.49 0 0 0 12.47 14h-.94c-1.88 0-3.63.55-5.11 1.49ZM12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
			clip-rule="evenodd"
			class=""
		></path>
	</svg>
`;

@customElement('discord-role-select-menu-option')
export class DiscordRoleSelectMenuOption extends BaseDiscordSelectMenuOption {
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

	@property({ reflect: true, attribute: 'name' })
	public name: string;

	@property({ reflect: true, attribute: 'color' })
	public color: string;

	@property({ type: Number, reflect: true, attribute: 'member-count' })
	public memberCount: number;

	@property({ type: Boolean, reflect: true, attribute: 'show-member-count' })
	public showMemberCount = true;

	@property({ reflect: true, attribute: 'icon-url' })
	public iconUrl?: string;

	public filter(searchValue: string) {
		return this.name.toLowerCase().includes(searchValue);
	}

	protected override render() {
		return html`
			<label style=${styleMap({ '--role-color': this.color })}>
				${when(
					this.iconUrl,
					() => html`
						<img
							src=${ifDefined(this.iconUrl)}
							alt=${ifDefined(this.name)}
							draggable="false"
							class="discord-string-select-menu-option-emoji"
							width="24"
							height="24"
						/>
					`,
					() => html`${roleIcon}`
				)}
				${this.renderSelectedContainer(
					html`<div class="discord-string-select-menu-option-ellipsis-text">
						<div class="discord-string-select-menu-option-ellipsis-text">
							<span>${this.name}</span>
							${when(this.showMemberCount, () => html`${roleCountIcon} <span>${this.memberCount}</span>`)}
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
		'discord-role-select-menu-option': DiscordRoleSelectMenuOption;
	}
}
