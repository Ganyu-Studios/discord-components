import { consume } from '@lit/context';
import { css, html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { Emoji, LightTheme } from '../../types.js';
import { getGlobalEmojiUrl } from '../../util.js';
import '../discord-custom-emoji/DiscordCustomEmoji.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';
import '../_private/DiscordWhiteSpace.js';

@customElement('discord-embed-field')
export class DiscordEmbedField extends LitElement implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			font-size: 0.875rem;
			line-height: 1.125rem;
			min-width: 0;
			font-weight: 400;
			grid-column: 1/13;
			word-break: break-word;
		}

		:host .discord-field-title {
			color: #ffffff;
			font-weight: 600;
			font-size: 0.875rem;
			line-height: 1.125rem;
			min-width: 0;
			margin-bottom: 2px;
		}

		:host .discord-inline-field {
			flex-grow: 1;
			flex-basis: auto;
			min-width: 150px;
		}

		:host([light-theme]) .discord-field-title {
			color: #313338;
		}

		:host {
			/* margin: 0px 2px; */
			--discord-code-background-color: color-mix(in oklab, hsl(230 calc(1 * 6.383%) 18.431% /1) 100%, #000 0%);
			--discord-code-border: none;
		}

		:host([light-theme]) {
			--discord-code-background-color: #f3f3f4;
		}
	`;

	@property({ reflect: true, attribute: 'field-title' })
	public fieldTitle!: string;

	/**
	 * An emoji that is prefixed to {@link DiscordEmbedField.fieldTitle | fieldTitle}.
	 *
	 * This should be keyed as `{ key: { emojiData } }` wherein `key`
	 * should occur in the {@link DiscordEmbedField.fieldTitle | fieldTitle}.
	 *
	 * By default this component will use the global emojis from
	 * {@link getGlobalEmojiUrl}, however on SSR frameworks like Nuxt 3 global config doesn't
	 * work so we provide this as an alternative method.
	 */
	@property({ attribute: false })
	public embedFieldEmojisMap: { [key: string]: Emoji } = {};

	/**
	 * Whether this field should be displayed inline or not.
	 */
	@property({ type: Boolean, reflect: true, attribute: 'inline' })
	public inline = false;

	/**
	 * The index of this inline field
	 *
	 * @remarks
	 * - This defines the position of this inline field. 1 is left, 2 is middle and 3 is right.
	 * - one of `[1, 2, 3]`
	 * @defaultValue 1
	 */
	@property({ type: Number, reflect: true, attribute: 'inline-index' })
	public inlineIndex: number | undefined = undefined;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public lightTheme = false;

	private readonly validInlineIndices = new Set([1, 2, 3]);

	public checkInlineIndex() {
		if (this.inlineIndex) {
			const inlineIndexAsNumber = Number(this.inlineIndex);
			if (!Number.isNaN(inlineIndexAsNumber) && !this.validInlineIndices.has(inlineIndexAsNumber)) {
				throw new RangeError('DiscordEmbedField `inlineIndex` prop must be one of: 1, 2, or 3');
			}
		}
	}

	protected override render() {
		this.checkInlineIndex();

		const emojiParsedEmbedFieldTitle = this.parseTitle(this.fieldTitle);

		const content = [...(emojiParsedEmbedFieldTitle as NonNullable<typeof emojiParsedEmbedFieldTitle>)];

		const component = html`<div class="discord-field-title">
			<discord-white-space><slot name="field-title">${content}</slot></discord-white-space>
		</div>`;

		return html`${component}<discord-white-space><slot></slot></discord-white-space>`;
	}

	private parseTitle(title?: string) {
		if (!title) return null;

		const el: (TemplateResult<1> | string)[] = [];
		let complete = '';

		for (const words of title.split('\n')) {
			for (const word of words.split(' ')) {
				const emoji = getGlobalEmojiUrl(word) ?? this.embedFieldEmojisMap[word] ?? ({} as Emoji);

				if (emoji.name) {
					el.push(html`<discord-custom-emoji name=${emoji.name} url=${ifDefined(emoji.url)} embed-emoji></discord-custom-emoji>`);
				} else {
					complete += `${word} `;
				}

				if (complete === ' ') {
					el.push(html`<br />`);
				}
			}

			el.push(complete);

			complete = '';
		}

		return el.map((wordOrHtmlTemplate) => {
			if (typeof wordOrHtmlTemplate === 'string') {
				return html`<span>${wordOrHtmlTemplate}</span>`;
			}

			return wordOrHtmlTemplate;
		});
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-embed-field': DiscordEmbedField;
	}
}
