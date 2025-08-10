import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { DiscordComponentsError } from '../../util.js';
import { BaseDiscordSelectMenuOption } from '../_private/BaseDiscordSelectMenuOption.js';

@customElement('discord-string-select-menu-option')
export class DiscordStringSelectMenuOption extends BaseDiscordSelectMenuOption {
	/**
	 * @internal
	 */
	public static override readonly styles = [
		css`
			label {
				padding: 8px 8px 8px 12px !important;
			}

			.discord-string-select-menu-option-emoji {
				margin-right: 4px;
				object-fit: contain;
				width: 1.375em;
				height: 1.375em;
				vertical-align: bottom;
			}

			.discord-string-select-menu-option-ellipsis-text {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.discord-string-select-menu-option-hidden {
				display: none;
			}

			:host([slot='default']) {
				.discord-string-select-menu-option-description {
					display: none;
				}
			}
		`,
		BaseDiscordSelectMenuOption.baseStyles
	];

	/**
	 * The emoji URL to use in the SelectMenu.
	 */
	@property({ reflect: true, attribute: 'emoji' })
	public emoji: string;

	/**
	 * The name of the emoji used in the SelectMenu.
	 */
	@property({ reflect: true, attribute: 'emoji-name' })
	public emojiName = 'emoji';

	/**
	 * The label of the option
	 */
	@property({ attribute: 'label' })
	public label: string;

	/**
	 * The description of the option
	 */
	@property({ attribute: 'description' })
	public description: string;

	public checkLabelIsProvided() {
		if (!this.label) {
			throw new DiscordComponentsError('The label of option is required');
		}
	}

	public filter(searchValue: string) {
		if (this.label.toLowerCase().includes(searchValue)) return true;
		return this.description?.toLowerCase().includes(searchValue);
	}

	protected override render() {
		this.checkLabelIsProvided();

		return html`
			<label>
				${when(this.emoji, () =>
					when(
						this.emoji?.includes('http') || this.emoji?.startsWith('/') || this.emoji?.startsWith('./'),
						() =>
							html`<img
								src=${this.emoji}
								alt=${ifDefined(this.emojiName)}
								draggable="true"
								class="discord-string-select-menu-option-emoji"
							/>`,
						() => html`<span class="discord-string-select-menu-option-emoji">${this.emoji}</span>`
					)
				)}
				${this.renderSelectedContainer(
					html`<div class="discord-string-select-menu-option-ellipsis-text">
						<div class="discord-string-select-menu-option-ellipsis-text">
							<strong>${this.label}</strong>
						</div>
						${when(this.description, () => html`<span class="discord-string-select-menu-option-description">${this.description}</span>`)}
					</div>`
				)}

				<span class="discord-string-select-menu-option-hidden"><input type="checkbox" @click=${this.selectOption} /></span>
			</label>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-string-select-menu-option': DiscordStringSelectMenuOption;
	}
}
