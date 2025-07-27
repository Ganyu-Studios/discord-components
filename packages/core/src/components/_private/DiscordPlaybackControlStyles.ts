import { css } from 'lit';

export const DiscordPlaybackControlStyles = css`
	.discord-media-attachment-horizontal {
		width: 100%;
		display: flex;
		align-self: stretch;
	}

	.discord-media-attachment-media-bar-interaction {
		position: relative;
		flex: 1 1 auto;
		align-self: stretch;
		display: flex;
		align-items: center;
		cursor: pointer;
		margin: 0 7px;
	}

	.discord-media-attachment-playback-control {
		position: relative;
		flex: 1 1 auto;
		height: 6px;
		border-radius: 3px;
		background-color: hsl(210 calc(1 * 9.3%) 78.8% / 0.3);
	}

	:host([light-theme]) {
		.discord-media-attachment-controls {
			background-color: hsl(0 calc(1 * 0%) 0% /0.4);
		}
	}

	.discord-media-attachment-controls.no-background {
		background-color: transparent !important;
	}

	.discord-media-attachment-playback-control:hover {
		box-shadow: 0 1px 1px hsl(0 calc(1 * 0%) 0% / 0.3);
	}

	.discord-media-attachment-playback-control::before {
		background-color: hsl(210 calc(1 * 9.3%) 78.8% / 0.3);
		left: -3px;
		border-radius: 3px 0 0 3px;
		content: '';
		position: absolute;
		top: 0;
		height: 100%;
		width: 3px;
		z-index: 1;
	}
	input[type='range'].discord-media-attachment-playback-control {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
	}

	input[type='range'].discord-media-attachment-playback-control::-webkit-slider-runnable-track {
		width: 2.47264%;
		height: 100%;
		cursor: pointer;
		opacity: 1;
		border-radius: 3px;
		background: linear-gradient(to right, hsla(0, 0%, 100%, 0.25) var(--buffered-width), transparent var(--buffered-width))
			hsl(240 calc(1 * 4.762%) 79.412% / 0.3);
	}

	input[type='range'].discord-media-attachment-playback-control::-moz-range-track {
		width: 2.47264%;
		height: 100%;
		cursor: pointer;
		opacity: 1;
		border-radius: 3px;
		background: linear-gradient(to right, hsla(0, 0%, 100%, 0.25) var(--buffered-width), transparent var(--buffered-width))
			hsl(240 calc(1 * 4.762%) 79.412% / 0.3);
	}

	input[type='range'].discord-media-attachment-playback-control::before {
		position: absolute;
		content: '';
		inset: 0;
		width: 100%;
		height: 100%;
		border-radius: 3px;
		z-index: 3;
		background: linear-gradient(
			to right,
			hsl(234.935 calc(1 * 85.556%) 64.706% /1) var(--seek-before-width),
			transparent var(--seek-before-width)
		);
		cursor: pointer;
	}

	input[type='range'].discord-media-attachment-playback-control::-webkit-slider-thumb {
		position: relative;
		cursor: pointer;
		border-radius: 100%;
		width: 8px;
		height: 8px;
		line-height: 8px;
		text-align: center;
		font-weight: 600;
		font-size: 12px;
		color: hsl(0 calc(1 * 0%) 97.6% / 1);
		opacity: 1;
		transition:
			opacity 0.2s ease-out,
			scale 0.2s ease-out;
		pointer-events: none;
		-webkit-appearance: none;
		box-sizing: content-box;
		background-color: hsl(234.935 calc(1 * 85.556%) 64.706% /1);
		z-index: 4;
		margin: -1px 0 0 0;
	}
	input[type='range'].discord-media-attachment-playback-control::-moz-range-thumb {
		position: relative;
		cursor: pointer;
		border-radius: 100%;
		width: 9px;
		height: 9px;
		line-height: 9px;
		text-align: center;
		font-weight: 600;
		font-size: 12px;
		color: hsl(0 calc(1 * 0%) 97.6% / 1);
		opacity: 1;
		transition:
			opacity 0.2s ease-out,
			scale 0.2s ease-out;
		pointer-events: none;
		-moz-appearance: none;
		box-sizing: content-box;
		background-color: hsl(234.935 calc(1 * 85.556%) 64.706% /1);
		z-index: 4;
		margin: -1px 0 0 0;
	}

	input[type='range'].discord-media-attachment-playback-control:hover::-webkit-slider-thumb {
		scale: 1.2;
		filter: brightness(85%);
	}
	input[type='range'].discord-media-attachment-playback-control:hover::-moz-range-thumb {
		scale: 1.2;
		filter: brightness(85%);
	}

	input[type='range'].discord-media-attachment-playback-control::-moz-range-progress {
		background-color: transparent;
	}

	input[type='range'].discord-media-attachment-playback-control::-moz-focus-outer {
		border: 0;
	}
`;
