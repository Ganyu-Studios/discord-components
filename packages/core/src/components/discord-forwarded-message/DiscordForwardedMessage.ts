import { consume, createContext, provide } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import type { DiscordTimestamp, LightTheme } from '../../types.js';
import { handleTimestamp } from '../../util.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

const capitalize = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

function dateFormatter(date: Date | string): string {
	const today = new Date();
	const inputDate = new Date(date);

	const isSameWeek = (d1: Date): boolean => {
		const startOfWeek1 = new Date(d1);
		startOfWeek1.setDate(d1.getDate() - d1.getDay());
		startOfWeek1.setHours(0, 0, 0, 0);

		const endOfWeek1 = new Date(d1);
		endOfWeek1.setDate(d1.getDate() + (6 - d1.getDay()));
		endOfWeek1.setHours(23, 59, 59, 999);

		return inputDate >= startOfWeek1 && inputDate <= endOfWeek1;
	};

	if (isSameWeek(today)) {
		const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
		return capitalize(inputDate.toLocaleDateString(void 0, options));
	} else {
		const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
		return inputDate.toLocaleDateString(void 0, options);
	}
}

export const forwardedMessageContext = createContext<boolean>(Symbol('forwarded-message-context'));

@customElement('discord-forwarded-message')
export class DiscordForwardedMessage extends LitElement implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		.discord-message-container {
			display: flex;
			flex-direction: column;
			gap: 4px;
		}

		header {
			color: #97989f;
			display: flex;
			align-items: center;
			gap: 4px;
			font-size: 15px;
			font-weight: 500;
			line-height: 16px;
		}

		footer {
			display: flex;
			align-items: center;
			margin-top: 4px;
			a {
				display: flex;
				padding: 0px;
				--footer-background-hover: hsl(240 calc(1 * 4%) 60.784% /0.0784313725490196);
				--footer-color-hover: color-mix(in oklab, hsl(0 calc(1 * 0%) 100% /1) 100%, #000 0%);
				align-self: flex-start;
				border-radius: 4px;
				align-items: center;
				gap: 4px;
				font-size: 14px;
				line-height: 16px;

				color: #72767d;
				font-weight: 500;
				padding: 1px;
				text-decoration: none;

				cursor: pointer;

				img {
					width: 16px;
					height: 16px;
					border-radius: 4px;
				}

				&:hover {
					background-color: var(--footer-background-hover);
					color: var(--footer-color-hover);
				}
			}
		}

		discord-quote {
			--quote-divider-background-color: color-mix(
				in oklab,
				hsl(240 calc(1 * 4%) 60.784% /0.12156862745098039) 100%,
				hsl(0 0% 0% /0.12156862745098039) 0%
			);
		}

		:host([light-theme]) {
			header {
				color: #5c5d67;
			}

			footer {
				a {
					--footer-background-hover: hsl(240 calc(1 * 4%) 60.784% /0.12156862745098039);
					--footer-color-hover: #2f3035;
				}
			}
		}
	`;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public lightTheme = false;

	@property({ reflect: true, attribute: 'channel-name' })
	public channelName?: string;

	@property({ reflect: true, attribute: 'guild-icon' })
	public guildIcon?: string;

	@property({
		reflect: true,
		converter: (value) => handleTimestamp(value, false, false),
		attribute: true
	})
	public timestamp?: DiscordTimestamp = new Date();

	@provide({ context: forwardedMessageContext })
	public isInforwardedMessage = true;

	@property({ type: String, reflect: true, attribute: 'href' })
	public href: string;

	protected override render() {
		return html`
			<discord-quote>
				<div class="discord-message-container">
					<header>
						<svg
							aria-hidden="true"
							role="img"
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								fill="var(--text-low-contrast)"
								d="M21.7 7.3a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L18.58 9H13a7 7 0 0 0-7 7v4a1 1 0 1 1-2 0v-4a9 9 0 0 1 9-9h5.59l-3.3-3.3a1 1 0 0 1 1.42-1.4l5 5Z"
								class=""
							></path>
						</svg>
						<discord-italic>Forwarded</discord-italic>
					</header>
					<slot></slot>
					${when(
						this.channelName && this.guildIcon,
						() => html`
							<footer>
								<a href=${ifDefined(this.href)} target="_blank" rel="noopener noreferrer">
									<img src="${this.guildIcon!}" alt="${this.channelName!}" />
									<span>${this.channelName}</span>
									<span>•</span>
									${dateFormatter(this.timestamp!)}
									<svg
										aria-hidden="true"
										role="img"
										xmlns="http://www.w3.org/2000/svg"
										width="12"
										height="12"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											fill="var(--text-low-contrast)"
											d="M9.3 5.3a1 1 0 0 0 0 1.4l5.29 5.3-5.3 5.3a1 1 0 1 0 1.42 1.4l6-6a1 1 0 0 0 0-1.4l-6-6a1 1 0 0 0-1.42 0Z"
											class=""
										></path>
									</svg>
								</a>
							</footer>
						`
					)}
				</div>
			</discord-quote>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-forwarded-message': DiscordForwardedMessage;
	}
}
