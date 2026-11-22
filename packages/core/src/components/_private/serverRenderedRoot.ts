import { isServer, LitElement } from 'lit';

/**
 * Components can arrive pre-rendered by the `./ssr` entry, inside a declarative shadow root. Lit
 * only reuses that content when its hydrate support is loaded; otherwise it renders a second copy
 * next to it. This bundle re-renders instead of hydrating (the server output carries no hydration
 * markers), so the server content has to go first.
 *
 * Clearing happens in createRenderRoot, and the first render follows in the same microtask
 * checkpoint, so the browser never paints the emptied root.
 */
const hasHydrateSupport = (): boolean => typeof (globalThis as { litElementHydrateSupport?: unknown }).litElementHydrateSupport === 'function';

/**
 * Empty a server-rendered shadow root before the first client render.
 *
 * @param element - The component.
 * @param lightDom - The component renders into its light DOM: keep a slot in the shadow root so the
 * light DOM stays visible (a host with a shadow root only shows what is slotted).
 */
export function resetServerRenderedRoot(element: HTMLElement, lightDom = false): void {
	if (isServer || hasHydrateSupport()) return;

	const root = element.shadowRoot;
	if (!root) return;

	if (lightDom) root.replaceChildren(document.createElement('slot'));
	else root.replaceChildren();
}

let installed = false;

/** Patch LitElement once so every component that keeps the default render root resets it. */
export function installServerRenderedRootReset(): void {
	if (installed || isServer) return;
	installed = true;

	const prototype = LitElement.prototype as unknown as { createRenderRoot(this: LitElement): HTMLElement | DocumentFragment };
	const createRenderRoot = prototype.createRenderRoot;

	prototype.createRenderRoot = function patchedCreateRenderRoot(this: LitElement) {
		resetServerRenderedRoot(this);
		return createRenderRoot.call(this);
	};
}

installServerRenderedRootReset();
