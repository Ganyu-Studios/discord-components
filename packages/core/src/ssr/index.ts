/**
 * Server-side rendering entry point (`@penwin/discord-components-core/ssr`).
 *
 * Registers every component and renders them through Lit SSR to HTML with declarative shadow DOM,
 * so a page displays its messages before (or without) the client bundle.
 *
 * Load the client bundle on the page as well: it re-renders each server-rendered component in
 * place (see `_private/serverRenderedRoot.ts`), which brings back interactivity and anything that
 * is only known from live children.
 *
 * Profiles, avatars and the other options are read from the global config. Either set
 * `globalThis.$discordMessage` before importing this module, or call {@link setConfig} afterwards
 * (it keeps the live `profiles`/`avatars` collections in sync), then render:
 *
 * ```ts
 * import { renderMarkup, setConfig } from '@penwin/discord-components-core/ssr';
 *
 * setConfig({ profiles: { '1': { author: 'User' } } });
 * const out = await renderMarkup('<discord-messages>…</discord-messages>');
 * ```
 */
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

// Side-effect import: registers every custom element so Lit SSR can render them.
import '../index.js';

export { render } from '@lit-labs/ssr';
export { collectResult } from '@lit-labs/ssr/lib/render-result.js';
export { html } from 'lit';
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
 * Render an HTML string of custom-element markup (e.g. built by a server-side template) to HTML
 * with declarative shadow DOM. Lit SSR expands every registered custom element found in it.
 *
 * @param markup - The HTML string to expand.
 * @returns The rendered HTML.
 */
export async function renderMarkup(markup: string): Promise<string> {
	return collectResult(render(html`${unsafeHTML(markup)}`));
}
