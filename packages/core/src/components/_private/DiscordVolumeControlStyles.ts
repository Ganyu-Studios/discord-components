import { css } from 'lit';

export const DiscordVolumeControlStyles = css`
	.discord-media-attachment-flex {
		display: flex;
	}

	.discord-media-attachment-flex-container {
		justify-content: flex-end;
		align-items: center;
		flex-direction: column;
		display: flex;
		position: relative;
	}

	.discord-volume-container {
		border-radius: 50%;

		&:hover,
		:has(:focus-visible) {
			.discord-media-attachment-button-slider {
				opacity: 1;
				pointer-events: all;
			}
		}
	}

	.discord-media-attachment-button-slider {
		--slider-width: 98px;
		--slider-height: 16px;
		position: absolute;
		padding-bottom: 4px;
		bottom: 32px;
		opacity: 0;
		pointer-events: none;

		width: var(--slider-height);
		height: var(--slider-width);

		-webkit-app-region: no-drag;

		.discord-media-attachment-volume-vertical {
			padding: 3px;
			border-radius: 8px;
			overflow: hidden;
			background-color: #141417;

			display: flex;
			align-items: center;

			width: var(--slider-width);
			height: var(--slider-height);
			box-sizing: border-box;
			transform-origin: top right;
			transform: rotate(-90deg) translateY(calc(var(--slider-width) * -1));

			input[type='range'] {
				-webkit-appearance: none;
				-moz-appearance: none;
				appearance: none;
				border-radius: 8px;
				background: hsl(240 calc(1 * 4.762%) 79.412% / 0.3);
				border-radius: 3px;
				overflow: hidden;

				&::-webkit-slider-thumb {
					-webkit-appearance: none;
					appearance: none;
					border-radius: 50%;
					width: 6px;
					height: 6px;
					background-color: hsl(234.935 calc(1 * 85.556%) 64.706%);
					box-shadow: -407px 0 0 404px hsl(234.935 calc(1 * 85.556%) 64.706%);
				}

				&::-moz-range-thumb {
					-webkit-appearance: none;
					appearance: none;
					border-radius: 50%;
					width: 6px;
					height: 6px;
					background-color: hsl(234.935 calc(1 * 85.556%) 64.706%);
					box-shadow: -407px 0 0 404px hsl(234.935 calc(1 * 85.556%) 64.706%);
				}
			}
		}
	}

	.discord-voice-message {
		.discord-media-attachment-button-slider {
			padding-bottom: 0px;
		}
	}

	:host([light-theme]) {
		.discord-media-attachment-volume-vertical {
			background-color: #515151;
		}
	}

	.discord-media-attachment-button {
		cursor: pointer;
		line-height: 0;
		width: auto;
		background: transparent;
		color: currentColor;
		border: 0;
		padding: 0;
		margin: 0;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		border-radius: 3px;
		font-size: 14px;
		font-weight: 500;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
	}

	.discord-volume-container {
		button {
			border-radius: 50%;
		}
	}

	.discord-media-attachment-button-content {
		--custom-button-link-underline-offset: 1px;
		--button--underline-color: transparent;
		--custom-button-link-underline-width: 1px;
		--custom-button-link-underline-stop: calc(var(--custom-button-link-underline-width) + var(--custom-button-link-underline-offset));

		background-image: linear-gradient(
			to top,
			transparent,
			transparent var(--custom-button-link-underline-offset),
			var(--button--underline-color) var(--custom-button-link-underline-offset),
			var(--button--underline-color) var(--custom-button-link-underline-stop),
			transparent var(--custom-button-link-underline-stop)
		);
	}

	.discord-media-attachment-button-control-icon {
		display: block;
		width: 24px;
		height: 24px;
		padding: 4px;
		cursor: pointer;
		flex: 0 0 auto;
		opacity: 0.6;
	}

	.discord-media-attachment-volume-slider {
		position: relative;
		height: 6px;
		background-color: hsl(210 calc(1 * 9.3%) 78.8% / 0.3);
		width: 88px;
	}
`;
