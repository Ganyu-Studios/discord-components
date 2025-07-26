import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { DiscordComponentsError } from '../../util.js';
import { discordContainerContext } from '../discord-container/DiscordContainer.js';
import LaunchIcon from '../svgs/LaunchIcon.js';

@customElement('discord-button')
export class DiscordButton extends LitElement {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host > *:first-child {
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;
			margin: 4px 8px 4px 0;
			width: auto;
			height: 32px;
			min-width: 60px;
			min-height: 32px;
			-webkit-transition:
				background-color 0.17s ease,
				color 0.17s ease;
			transition:
				background-color 0.17s ease,
				color 0.17s ease;
			border-radius: 8px;
			font-size: 14px;
			font-weight: 500;
			line-height: 18px;
			text-decoration: none !important;
			border: 1px solid #47484f;
			box-sizing: border-box;
			padding: 3px 11px;
			font-family: 'gg sans', 'Noto Sans', Whitney, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;

			&.is-in-container {
				margin: 0;
			}
		}

		.discord-button-launch {
			margin-left: 8px;
		}

		:host([small]) > *:first-child,
		:host > *:first-child.is-in-container {
			height: 32px;
			line-height: 18px;
			min-height: 32px;
		}

		.success {
			color: #fff;
			background-color: #00863a;
			border-color: #148f49 !important;
		}

		.success.hoverable:hover {
			background-color: #047e37;
		}

		.destructive {
			color: #fff;
			background-color: #d22d39;
			border-color: #d63d49 !important;
		}

		.destructive.hoverable:hover {
			background-color: #b42831;
		}

		.primary {
			color: #fff;
			background-color: #5865f2;
			border-color: #6571f3 !important;
		}

		.primary.hoverable:hover {
			background-color: #4654c0;
		}

		.secondary {
			color: #fff;
			background-color: #44454c;
		}

		.secondary.hoverable:hover {
			background-color: #4c4c54;
		}

		.disabled {
			cursor: not-allowed !important;
			opacity: 0.5;
		}

		.launch {
			margin-left: 8px;
		}

		.emoji {
			margin-right: 4px;
			object-fit: contain;
			width: 1.375em;
			height: 1.375em;
			vertical-align: bottom;
		}

		.discord-button-content {
			display: flex;
			align-items: center;
		}
	`;

	/**
	 * The emoji URL to use in the button.
	 */
	@property({ reflect: true, attribute: 'emoji' })
	public emoji: string;

	/**
	 * The name of the emoji used in the button.
	 */
	@property({ reflect: true, attribute: 'emoji-name' })
	public emojiName = 'emoji';

	/**
	 * The URL for the button. Setting this will force the button type to be `secondary`.
	 */
	@property({ reflect: true, attribute: 'url' })
	public url: string;

	/**
	 * Whether to show the button as disabled.
	 */
	@property({ type: Boolean, reflect: true, attribute: 'disabled' })
	public disabled = false;

	/**
	 * The type of button this is, this will change the color of the button.
	 * Valid values: `primary`, `secondary`, `success`, `destructive`.
	 */
	@property({ reflect: true, attribute: 'type' })
	public type: 'destructive' | 'primary' | 'secondary' | 'success' = 'secondary';

	/**
	 * An `id` of a modal that should be opened when this button is clicked. This should match the `modal-id` of a `discord-modal` element.
	 *
	 * @remarks
	 * - `discord-modal`s use the HTML [dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) element. and are opened through `<ref>.showModal()`
	 * - If {@link DiscordButton.url} is set this will be ignored.
	 * - If {@link DiscordButton.disabled} is set this will be ignored.
	 */
	@property({ reflect: true, attribute: 'modal-id' })
	public modalId: string;

	@property({ type: Boolean, reflect: true, attribute: 'small' })
	public small = false;

	private readonly validButtonTypes = new Set(['primary', 'secondary', 'success', 'destructive']);

	@consume({ context: discordContainerContext })
	public isInContainer = false;

	public checkType() {
		if (this.type) {
			if (typeof this.type !== 'string') {
				throw new TypeError('DiscordButton `type` prop must be a string.');
			} else if (!this.validButtonTypes.has(this.type)) {
				throw new RangeError("DiscordButton `type` prop must be one of: 'primary', 'secondary', 'success', 'destructive'");
			}
		}
	}

	public checkParentElement() {
		if (this.parentElement?.tagName.toLowerCase() !== 'discord-action-row' && this.parentElement?.tagName.toLowerCase() !== 'discord-section') {
			throw new DiscordComponentsError('All <discord-button> components must be direct children of <discord-action-row>.');
		}
	}

	protected handleButtonClick() {
		if (this.modalId) {
			const rootDiscordMessagesElement = this.parentElement?.parentElement?.parentElement?.parentElement;
			if (rootDiscordMessagesElement?.tagName?.toLowerCase() === 'discord-messages') {
				const discordModalComponent = rootDiscordMessagesElement?.querySelector(`discord-modal`);
				const dialogElement = discordModalComponent?.shadowRoot?.querySelector(`dialog#${this.modalId}`);
				const divRootModal = dialogElement?.querySelector(`div.discord-modal-box`);

				if (dialogElement instanceof HTMLDialogElement && divRootModal instanceof HTMLDivElement) {
					dialogElement.showModal();
					divRootModal.style.display = 'flex';

					if (discordModalComponent) {
						const originalDocumentOverflowStyle = globalThis.getComputedStyle(globalThis.document.body).overflow;
						discordModalComponent.originalBodyOverflow = originalDocumentOverflowStyle;

						globalThis.document.body.style.overflow = 'hidden';
					}
				}
			}
		}
	}

	protected override render() {
		this.checkType();
		this.checkParentElement();

		const isActiveLinkButton = this.url && !this.disabled;

		const content = html`
			<div class="discord-button-content">
				${when(this.emoji, () => html`<img src=${this.emoji} alt=${this.emojiName} draggable="true" class="emoji" />`)}
				<span>
					<slot></slot>
				</span>
				${when(this.url, () => LaunchIcon())}
			</div>
		`;

		if (isActiveLinkButton) {
			return html`<a
				class=${classMap({
					'is-in-container': this.isInContainer,
					secondary: true,
					hoverable: true
				})}
				href=${this.url}
				target="_blank"
				rel="noopener noreferrer"
				>${content}</a
			>`;
		}

		return html`<button
			class=${classMap({
				[this.type]: true,
				disabled: this.disabled,
				hoverable: !this.disabled,
				'is-in-container': this.isInContainer
			})}
			@click=${this.handleButtonClick}
		>
			${content}
		</button>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-button': DiscordButton;
	}
}
