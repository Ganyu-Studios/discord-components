import { consume } from '@lit/context';
import { html, LitElement, type TemplateResult, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { LightTheme } from '../../types.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

@customElement('discord-select-menu-portal')
export class DiscordSelectMenuPortal extends LitElement implements LightTheme {
	public static override styles = css`
		:host {
			display: contents;
		}
	`;

	@property({ type: String })
	public type: 'channel' | 'mentionable' | 'role' | 'user';

	@property({ type: String, attribute: 'default-identifier', reflect: true })
	public defaultIdentifier?: string;

	@property({ type: String, attribute: 'default-type', reflect: true })
	public defaultType?: 'channel' | 'role' | 'user';

	@property({ type: Boolean, reflect: true })
	public disabled = false;

	@property({ attribute: 'placeholder' })
	public placeholder: string = 'Make a selection';

	@consume({ context: messagesLightTheme })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public lightTheme = false;

	protected override render() {
		const options: TemplateResult[] = [];
		const isMentionable = this.type === 'mentionable';
		const hasRoles = this.type === 'role' || isMentionable;
		const hasUsers = this.type === 'user' || isMentionable;
		const hasChannels = this.type === 'channel' || isMentionable;

		const data = globalThis.$discordSelectMenu;

		if (hasUsers && data?.users) {
			const isDefaultInUsers = !this.defaultType || this.defaultType === 'user';
			for (const user of data.users) {
				options.push(
					html`<discord-user-select-menu-option
						identifier=${user.identifier}
						avatar-url=${user.avatarUrl}
						username=${user.username}
						discriminator=${user.discriminator}
						global-name=${ifDefined(user.globalName)}
						?bot=${user.bot}
						?verified=${user.verified}
						?selected=${user.identifier === this.defaultIdentifier && isDefaultInUsers}
					></discord-user-select-menu-option>`
				);
			}
		}

		if (hasRoles && data?.roles) {
			const isDefaultInRoles = !this.defaultType || this.defaultType === 'role';
			for (const role of data.roles) {
				options.push(
					html`<discord-role-select-menu-option
						identifier=${role.identifier}
						name=${role.name}
						color=${role.color}
						member-count=${role.memberCount}
						icon-url=${ifDefined(role.iconUrl)}
						?selected=${role.identifier === this.defaultIdentifier && isDefaultInRoles}
						.showMemberCount=${role.showMemberCount ?? true}
					></discord-role-select-menu-option>`
				);
			}
		}

		if (hasChannels && data?.channels) {
			const isDefaultInChannels = !this.defaultType || this.defaultType === 'channel';
			for (const channel of data.channels) {
				options.push(
					html`<discord-channel-select-menu-option
						identifier=${channel.identifier}
						name=${channel.name}
						type=${channel.type}
						?selected=${channel.identifier === this.defaultIdentifier && isDefaultInChannels}
					></discord-channel-select-menu-option>`
				);
			}
		}

		return html`
			<discord-mentionable-select-menu light-theme=${this.lightTheme} placeholder=${this.placeholder} ?disabled=${this.disabled}
				>${options}</discord-mentionable-select-menu
			>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-select-menu-portal': DiscordSelectMenuPortal;
	}
}
