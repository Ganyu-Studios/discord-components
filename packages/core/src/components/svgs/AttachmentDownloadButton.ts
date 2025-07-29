import { html, svg } from 'lit';
import { spread } from '../../spread.js';

const svgContent = svg`
	<path
		fill="currentColor"
		d="M12 2a1 1 0 0 1 1 1v10.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.42l3.3 3.3V3a1 1 0 0 1 1-1ZM3 20a1 1 0 1 0 0 2h18a1 1 0 1 0 0-2H3Z"
	/>
`;

export default function AttachmentDownloadButton(props: Record<string, unknown> = {}) {
	return html`<svg
		${spread(props)}
		class="discord-icon-download"
		aria-hidden="true"
		role="img"
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		fill="none"
		viewBox="0 0 24 24"
	>
		${svgContent}
	</svg>`;
}

export function AttachmentLanguageSelectorSvg(props: Record<string, unknown> = {}) {
	return html`<svg
		${spread(props)}
		class="discord-icon-download"
		aria-hidden="true"
		role="img"
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		fill="none"
		viewBox="0 0 24 24"
	>
		<path
			fill="currentColor"
			d="M9.6 7.8 4 12l5.6 4.2a1 1 0 0 1 .4.8v1.98c0 .21-.24.33-.4.2l-8.1-6.4a1 1 0 0 1 0-1.56l8.1-6.4c.16-.13.4-.01.4.2V7a1 1 0 0 1-.4.8ZM14.4 7.8 20 12l-5.6 4.2a1 1 0 0 0-.4.8v1.98c0 .21.24.33.4.2l8.1-6.4a1 1 0 0 0 0-1.56l-8.1-6.4a.25.25 0 0 0-.4.2V7a1 1 0 0 0 .4.8Z"
			class=""
		></path>
	</svg>`;
}

export function AttachmentLanguageSearchSvg(props: Record<string, unknown> = {}) {
	return html`<svg
		${spread(props)}
		class="discord-icon-download"
		aria-hidden="true"
		role="img"
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		fill="none"
		viewBox="0 0 24 24"
	>
		<path
			fill="currentColor"
			fill-rule="evenodd"
			d="M15.62 17.03a9 9 0 1 1 1.41-1.41l4.68 4.67a1 1 0 0 1-1.42 1.42l-4.67-4.68ZM17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
			clip-rule="evenodd"
			class=""
		></path>
	</svg>`;
}

export function AttachmentLanguageSearchXSvg(props: Record<string, unknown> = {}) {
	return html`<svg
		${spread(props)}
		class="discord-icon-download"
		aria-hidden="true"
		role="img"
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		fill="none"
		viewBox="0 0 24 24"
	>
		<path
			fill="currentColor"
			d="M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z"
			class=""
		></path>
	</svg>`;
}
