import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { BaseDiscordSelectMenuOption } from '../_private/BaseDiscordSelectMenuOption.js';

@customElement('discord-user-select-menu-option')
export class DiscordUserSelectMenuOption extends BaseDiscordSelectMenuOption {
	/**
	 * @internal
	 */
	public static override readonly styles = [
		css`
			label {
				padding: 8px 8px 8px 12px !important;
			}

			img {
				margin-right: 4px;
				vertical-align: bottom;
				border-radius: 50%;
				object-fit: cover;
			}

			.discord-string-select-menu-option-ellipsis-text {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				display: flex;
				align-items: center;
				gap: 4px;
			}

			strong {
				font-weight: 600;
			}

			span {
				color: #8e9ea4;
			}

			.discord-string-select-menu-option-hidden {
				display: none;
			}

			discord-verified-author-tag {
				font-size: 12px;
				font-weight: 600;
			}
		`,
		BaseDiscordSelectMenuOption.baseStyles
	];

	@property({ reflect: true, attribute: 'user-id' })
	public userId: string;

	@property({ reflect: true, attribute: 'avatar-url' })
	public avatarUrl: string;

	@property({ reflect: true })
	public username: string;

	@property({ reflect: true })
	public discriminator: string;

	@property({ reflect: true, attribute: 'global-name' })
	public globalName: string;

	@property({ type: Boolean, reflect: true, attribute: 'bot' })
	public bot = false;

	@property({ type: Boolean, reflect: true, attribute: 'verified' })
	public verified = false;

	public filter(searchValue: string) {
		if (this.username.toLowerCase().includes(searchValue)) return true;
		const tag = `${this.username}#${this.discriminator}`;
		return tag.toLowerCase().includes(searchValue);
	}

	protected override render() {
		return html`
			<label>
				<img
					src=${this.avatarUrl}
					alt=${ifDefined(this.username)}
					draggable="false"
					class="discord-string-select-menu-option-emoji"
					width="24"
					height="24"
				/>

				${this.renderSelectedContainer(
					html`<div class="discord-string-select-menu-option-ellipsis-text">
						<div class="discord-string-select-menu-option-ellipsis-text">
							<strong>${this.globalName ?? this.username}</strong>
							<span>${this.discriminator === '0' ? this.username : `${this.username}#${this.discriminator}`}</span>
							${when(this.bot, () => html`<discord-verified-author-tag .verified=${this.verified}></discord-verified-author-tag>`)}
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
		'discord-user-select-menu-option': DiscordUserSelectMenuOption;
	}
}
