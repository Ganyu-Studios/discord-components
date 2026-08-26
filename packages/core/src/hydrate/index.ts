/**
 * Server-side rendering entry point.
 *
 * Registering every component here and rendering through Lit SSR pre-renders the components to
 * HTML with declarative shadow DOM, so a transcript displays correctly with no client JavaScript.
 *
 * Profiles, avatars and the other options are read from the global config. Either set
 * `globalThis.$discordMessage` before importing this module, or call {@link setConfig} afterwards
 * — `setConfig` keeps the live `profiles`/`avatars` collections in sync — then render:
 *
 * ```ts
 * import { html, renderToString, setConfig } from '@penwin/discord-components-core/hydrate';
 *
 * setConfig({ profiles: { '1': { author: 'User' } } });
 * const out = await renderToString(html`<discord-messages>…</discord-messages>`);
 * ```
 */
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

// Side-effect import: registers every custom element so Lit SSR can render them.
import '../index.js';

export { html } from 'lit';
export { render } from '@lit-labs/ssr';
export { collectResult } from '@lit-labs/ssr/lib/render-result.js';
export { setConfig } from '../config.js';

/**
 * Render a Lit template to an HTML string with declarative shadow DOM.
 *
 * @param value - The Lit `TemplateResult` (or renderable) to render.
 * @returns The rendered HTML.
 */
export async function renderToString(value: Parameters<typeof render>[0]): Promise<string> {
	return collectResult(render(value));
}

/**
 * Render a server-rendered HTML string (custom-element markup, e.g. from React SSR) to HTML with
 * declarative shadow DOM. Lit SSR expands every registered custom element found in the markup, so
 * the transcript displays correctly without any client JavaScript.
 *
 * @param markup - The HTML string to expand.
 * @returns The rendered HTML.
 */
export async function renderMarkup(markup: string): Promise<string> {
	return collectResult(render(html`${unsafeHTML(markup)}`));
}
