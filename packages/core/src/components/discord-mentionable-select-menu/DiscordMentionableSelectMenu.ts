import { customElement } from 'lit/decorators.js';
import { DiscordStringSelectMenu } from '../discord-string-select-menu/DiscordStringSelectMenu.js';

@customElement('discord-mentionable-select-menu')
export class DiscordMentionableSelectMenu extends DiscordStringSelectMenu {
	public override withSearch = true;
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-mentionable-select-menu': DiscordMentionableSelectMenu;
	}
}
