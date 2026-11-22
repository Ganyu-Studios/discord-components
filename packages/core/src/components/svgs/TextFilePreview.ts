import { html } from 'lit';

/**
 * A document with a code glyph, shown before the language name.
 */
export function TextFileCodeSvg() {
	return html`<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			fill-rule="evenodd"
			d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8.41a3 3 0 0 0-.88-2.12l-3.41-3.41A3 3 0 0 0 15.59 2H5Zm4.7 9.7a1 1 0 0 0-1.4-1.4l-2.5 2.5a1 1 0 0 0 0 1.4l2.5 2.5a1 1 0 0 0 1.4-1.4L7.92 13.5l1.8-1.8Zm4.6-1.4a1 1 0 0 1 1.4 0l2.5 2.5a1 1 0 0 1 0 1.4l-2.5 2.5a1 1 0 0 1-1.4-1.4l1.79-1.8-1.8-1.8a1 1 0 0 1 0-1.4Z"
			clip-rule="evenodd"
		></path>
	</svg>`;
}

/**
 * Chevron for "show more" / "show less". It points down and is rotated when expanded.
 */
export function TextFileExpandSvg() {
	return html`<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
		<path fill="currentColor" d="M5.3 9.3a1 1 0 0 1 1.4 0l5.3 5.29 5.3-5.3a1 1 0 1 1 1.4 1.42l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.42Z"></path>
	</svg>`;
}

/**
 * Two arrows pointing at opposite corners: open the full view.
 */
export function TextFileMaximizeSvg() {
	return html`<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M14 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V5.41l-4.3 4.3a1 1 0 0 1-1.4-1.42L18.58 4H15a1 1 0 0 1-1-1ZM3 14a1 1 0 0 1 1 1v3.59l4.3-4.3a1 1 0 0 1 1.4 1.42L5.42 20H9a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1Z"
		></path>
	</svg>`;
}

/**
 * Three horizontal dots: the overflow menu.
 */
export function TextFileMoreSvg() {
	return html`<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			fill-rule="evenodd"
			d="M4 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
			clip-rule="evenodd"
		></path>
	</svg>`;
}

/**
 * Close (X), for the full view.
 */
export function TextFileCloseSvg() {
	return html`<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z"
		></path>
	</svg>`;
}

/**
 * Check mark for a ticked menu checkbox.
 */
export function TextFileCheckSvg() {
	return html`<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M21.7 5.3a1 1 0 0 1 0 1.4l-12 12a1 1 0 0 1-1.4 0l-6-6a1 1 0 1 1 1.4-1.4L9 16.58l11.3-11.3a1 1 0 0 1 1.4 0Z"
		></path>
	</svg>`;
}
