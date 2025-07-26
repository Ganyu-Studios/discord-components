/**
 * this file is based on
 * https://github.com/ItzDerock/discord-components/tree/main/packages/core/src/components/discord-code-block
 */

import { consume } from '@lit/context';
import hljs from 'highlight.js';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import type { LightTheme } from '../../types.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

@customElement('discord-code-block')
export class DiscordCodeBlock extends LitElement implements LightTheme {
	protected override createRenderRoot() {
		return this;
	}

	@property()
	public language: string | undefined;

	/**
	 * The code to display.
	 */
	@property()
	public code: string;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public lightTheme = false;

	public override render() {
		// check if hljs has the language
		const language = this.language ? (hljs.getLanguage(this.language) ? this.language : 'plaintext') : 'plaintext';

		return html`<div class="discord-code-block-pre discord-code-block-pre--multiline language">
			<code class=${`hljs language-${language}`}>${unsafeHTML(hljs.highlight(this.code, { language }).value)}</code>
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-code-block': DiscordCodeBlock;
	}
}
