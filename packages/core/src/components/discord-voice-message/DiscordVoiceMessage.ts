import { consume, createContext } from '@lit/context';
import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import WaveSurfer from 'wavesurfer.js';
import type { LightTheme } from '../../types.js';
import { DiscordMediaAttachmentStyles } from '../_private/DiscordMediaAttachmentStyles.js';
import { DiscordMediaLifecycle } from '../_private/DiscordMediaLifecycle.js';
import { DiscordPlaybackControlStyles } from '../_private/DiscordPlaybackControlStyles.js';
import { DiscordVolumeControlStyles } from '../_private/DiscordVolumeControlStyles.js';
import '../discord-link/DiscordLink.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';
import MediaPauseIcon from '../svgs/MediaPauseIcon.js';
import MediaPlayIcon from '../svgs/MediaPlayIcon.js';
import MediaRestartIcon from '../svgs/MediaRestartIcon.js';
import MediaVolumeAbove50PercentIcon from '../svgs/MediaVolumeAbove50PercentIcon.js';
import MediaVolumeBelow50PercentIcon from '../svgs/MediaVolumeBelow50PercentIcon.js';
import MediaVolumeMutedIcon from '../svgs/MediaVolumeMutedIcon.js';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const speedContext = createContext<number>(Symbol('discord-voice-message-speed'));

@customElement('discord-voice-message')
export class DiscordVoiceNote extends DiscordMediaLifecycle implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = [
		DiscordVolumeControlStyles,
		DiscordPlaybackControlStyles,
		DiscordMediaAttachmentStyles,
		css`
			:host {
				--seek-before-width: 0%;
				--buffered-width: 0%;
				--volume-slider-opacity: 0;
			}

			.discord-audio-attachment-non-visual-media-item {
				width: -moz-fit-content;
				width: fit-content;
				max-width: 100%;
			}

			.discord-media-attachment-mosaic-item-media {
				width: 100%;
			}

			.discord-audio-attachment-wrapper-audio {
				background-color: hsl(240 calc(1 * 4%) 60.784% /0.0784313725490196);
				border-color: color-mix(in oklab, hsl(240 calc(1 * 4%) 60.784% /0.12156862745098039) 100%, hsl(0 0% 0% /0.12156862745098039) 0%);
				border-radius: 24px;
				border-style: solid;
				border-width: 1px;
				box-sizing: border-box;
				color: hsl(0 calc(1 * 0%) 100% / 1);
				display: flex;
				flex-direction: column;
				flex: auto;
				height: auto;
				justify-content: space-between;
				max-width: 100%;
				overflow: visible;
				padding: 12px 9px;
				position: relative;
				user-select: none;
				min-width: 240px;
				width: var(--target-width, auto);
				max-width: 480px;

				transition: background-color 0.2s ease-in;

				.discord-media-attachment-video-button {
					background-color: hsl(234.935 calc(1 * 85.556%) 64.706% /1);
					border-radius: 50%;
					color: hsl(0 calc(1 * 0%) 100% /1);

					svg {
						width: 16px;
						height: 16px;
						margin: 4px;
					}

					.discord-media-attachment-control-icon {
						opacity: 1;
					}
				}

				&.isPlaying {
					background-color: hsl(234.935 calc(1 * 85.556%) 64.706% /1);

					.discord-media-attachment-video-button {
						background-color: white;
						color: hsl(234.935 calc(1 * 85.556%) 64.706% /1);
					}
				}

				.discord-media-attachment-button {
					svg {
						opacity: 0.7;
					}
					&:hover svg {
						opacity: 1;
					}
				}

				&.discord-audio-attachment-light-theme {
					border-color: #dcdcdf;
					background-color: linear-gradient(
						151.11deg,
						hsl(231.298 calc(1 * 90.345%) 71.569% /1) 0,
						hsl(234.935 calc(1 * 85.556%) 64.706% /1) 100%
					);

					&:not(.isPlaying) {
						.discord-media-attachment-duration-time-display {
							color: #5f606a;
						}
						.discord-media-attachment-button {
							color: #2f3035;
						}

						.discord-media-attachment-speed-display {
							background-color: color-mix(
								in oklab,
								hsl(240 calc(1 * 4%) 60.784% /0.2784313725490196) 100%,
								hsl(0 0% 0% /0.2784313725490196) 0%
							);
							color: color-mix(in oklab, hsl(234.545 calc(1 * 5.473%) 39.412% /1) 100%, #000 0%);

							&:hover {
								background-color: hsl(240 calc(1 * 4%) 60.784% /0.12156862745098039);
								color: color-mix(in oklab, hsl(230 calc(1 * 6%) 19.608% /1) 100%, #000 0%);
							}
						}
					}
				}
			}

			.discord-audio-attachment-audio-element {
				display: none !important;
				position: absolute;
				width: 0;
				height: 0;
			}

			.discord-media-attachment-controls {
				margin: 0px;
				height: 24px;
				display: grid;
				gap: 6px;
				align-content: center;
				grid-template-columns: auto 1fr auto auto;
			}

			.discord-media-attachment-horizontal {
				display: flex;
				align-items: center;

				& > div:not(:first-child) {
					width: 100%;
				}
			}

			.discord-media-attachment-duration-time-wrapper {
				font-family: 'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
				font-size: 14px;
				font-weight: 400;
				color: color-mix(in oklab, hsl(228 calc(1 * 4.425%) 77.843% /1) 100%, #000 0%);
				display: flex;
				align-items: center;
				gap: 12px;
			}

			.discord-media-attachment-media-bar-interaction {
				display: none;
			}

			.discord-media-attachment-speed-display {
				display: inline-flex;
				align-items: center;
				font-weight: 600;
				justify-content: center;
				font-size: 12px;
				font-family: 'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
				background-color: color-mix(in oklab, hsl(240 calc(1 * 4%) 60.784% /0.12156862745098039) 100%, hsl(0 0% 0% /0.12156862745098039) 0%);
				color: color-mix(in oklab, hsl(228 calc(1 * 4.425%) 77.843% /1) 100%, #000 0%);
				width: 32px;
				border-radius: 4px;
				text-align: center;
				transition:
					background-color 0.2s ease-in,
					color 0.2s ease-in;

				border: none;
				cursor: pointer;
				white-space: nowrap;

				&:hover {
					background-color: hsl(240 calc(1 * 4%) 60.784% /0.0784313725490196);
					color: color-mix(in oklab, hsl(0 calc(1 * 0%) 100% /1) 100%, #000 0%);
				}
			}

			:focus-visible {
				outline: 2px solid hsl(234.935 calc(1 * 85.556%) 64.706% /1);
				outline-offset: 2px;
			}
		`
	];

	public get mediaAttachmentHorizontal(): HTMLDivElement | null {
		return this.renderRoot?.querySelector('.discord-media-attachment-horizontal');
	}

	public get audioAttachmentWrapperAudio(): HTMLDivElement | null {
		return this.renderRoot?.querySelector('.discord-audio-attachment-wrapper-audio');
	}

	@property({ type: Number, reflect: true })
	public duration?: number;

	public getDuration() {
		if (this.duration) return this.duration;
		if (!this.mediaComponentRef.value) return 0;
		return this.mediaComponentRef.value.duration;
	}

	private patchWidthAndDuration(duration?: number) {
		const mins = (duration ?? this.getDuration()) / 60;
		const raw = 140 * Math.round(mins);
		const width = clamp(raw, 240, 480);
		this.audioAttachmentWrapperAudio?.style.setProperty('--target-width', `${width}px`);
		this.displayLeftPlaybackPosition(0);
	}

	public speeds = [0.75, 1, 1.5, 2];

	@consume({ context: speedContext, subscribe: true })
	@property({ type: Number, reflect: true })
	public speed = 1;

	public getNextSpeed() {
		const index = this.speeds.indexOf(this.speed);
		if (index === -1) return this.speeds[0];
		return this.speeds[index + 1] ?? this.speeds[0];
	}

	private readonly nextSpeed = () => {
		const nextSpeed = this.getNextSpeed();
		this.wavesurfer?.setPlaybackRate(nextSpeed);
		this.speed = nextSpeed;
	};

	private getCurrentWaveColor() {
		if (this.isPlaying) {
			return {
				waveColor: '#707bf4',
				progressColor: '#ffffff'
			};
		}

		return {
			waveColor: this.lightTheme ? '#c4c9ce' : '#4b4d55',
			progressColor: this.lightTheme ? '#2f3035' : '#ffffff'
		};
	}

	private patchWaveColors() {
		if (!this.wavesurfer) return;

		const colors = this.getCurrentWaveColor();

		this.wavesurfer.setOptions({
			waveColor: colors.waveColor,
			progressColor: colors.progressColor
		});
	}

	@property({ type: String })
	public peaks?: string;

	public override firstUpdated(): void {
		const colors = this.getCurrentWaveColor();

		this.wavesurfer = WaveSurfer.create({
			container: this.mediaAttachmentHorizontal!,
			media: this.mediaComponentRef.value!,
			url: this.href,
			waveColor: colors.waveColor,
			progressColor: colors.progressColor,
			audioRate: this.speed,
			barWidth: 2,
			barGap: 4,
			barRadius: 2,
			cursorWidth: 0,
			fetchParams: {
				mode: 'no-cors'
			},
			peaks: this.peaks && JSON.parse(this.peaks),
			backend: 'MediaElement',
			height: 24,
			dragToSeek: true
		});

		this.wavesurfer.on('play', () => this.patchWaveColors());
		this.wavesurfer.on('pause', () => this.patchWaveColors());

		this.wavesurfer.on('decode', () => {
			this.patchWidthAndDuration();
		});

		this.wavesurfer.on('error', console.error);

		this.wavesurfer.on('drag', (target) => {
			const duration = this.getDuration();
			const targetPosition = duration * target;
			this.displayLeftPlaybackPosition(targetPosition);
		});
	}

	public override disconnectedCallback() {
		super.disconnectedCallback();
		this.wavesurfer?.destroy();
	}

	public override updated(changedProperties: Map<number | string | symbol, unknown>) {
		if (changedProperties.has('light-theme')) this.patchWaveColors();
	}

	/**
	 * The URL to audio file
	 *
	 * @example
	 * ```ts
	 * 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'
	 * ```
	 */
	@property()
	public href: string;

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public lightTheme = false;

	protected override render() {
		return html`<div class="discord-media-attachment-non-visual-media-item-container discord-voice-message">
			<div class="discord-audio-attachment-non-visual-media-item">
				<div class="discord-media-attachment-mosaic-item-media">
					<div
						class=${classMap({
							'discord-audio-attachment-wrapper-audio': true,
							'discord-audio-attachment-light-theme': this.lightTheme,
							isPlaying: this.isPlaying
						})}
					>
						<audio
							${ref(this.mediaComponentRef)}
							class="discord-audio-attachment-audio-element"
							preload="metadata"
							@progress=${this.displayBufferedAmount}
							@ended=${this.handleEnded}
						>
							<source src=${ifDefined(this.href)} />
						</audio>
						<div class="discord-media-attachment-controls no-background" style="transform: translateY(0%)">
							<div
								class="discord-media-attachment-video-button"
								tabindex="0"
								aria-label="${this.isPlaying ? 'Pause' : 'Play'}"
								role="button"
								@click=${this.handleClickPlayPauseIcon}
								@keydown=${this.handleSpaceToPlayPause}
							>
								${when(
									this.hasEnded,
									() => MediaRestartIcon({ class: 'discord-media-attachment-control-icon' }),
									() =>
										when(
											this.isPlaying,
											() => MediaPauseIcon({ class: 'discord-media-attachment-control-icon' }),
											() => MediaPlayIcon({ class: 'discord-media-attachment-control-icon' })
										)
								)}
							</div>

							<div class="discord-media-attachment-horizontal">
								<div class="discord-media-attachment-media-bar-interaction">
									<input
										type="range"
										${ref(this.seekSliderRef)}
										class="discord-media-attachment-playback-control"
										@input=${this.handleSeekSliderInput}
										@change=${this.handleSeekSliderChange}
										max="100"
										value="0"
									/>
								</div>
							</div>
							<div class="discord-media-attachment-duration-time-wrapper">
								<span role="status" class="discord-media-attachment-duration-time-display">${this.leftPlaybackPosition}</span>
								<button class="discord-media-attachment-speed-display" @click=${this.nextSpeed}>
									${this.speed < 1 ? this.speed.toString().slice(1) : this.speed}X
								</button>
							</div>
							<div class="discord-media-attachment-flex discord-volume-container">
								<div class="discord-media-attachment-flex-container">
									<button
										aria-label="Control volume"
										type="button"
										class="discord-media-attachment-button"
										@focus=${this.handleVolumeVerticalFocus}
										@blur=${this.handleVolumeVerticalBlur}
										@click=${this.handleClickMuteIcon}
									>
										<div class="discord-media-attachment-button-content">
											${when(
												this.currentVolume === 0 || this.isMuted,
												() => MediaVolumeMutedIcon({ class: 'discord-media-attachment-button-control-icon' }),
												() =>
													when(
														this.currentVolume <= 0.5,
														() =>
															MediaVolumeBelow50PercentIcon({
																class: 'discord-media-attachment-button-control-icon'
															}),
														() =>
															MediaVolumeAbove50PercentIcon({
																class: 'discord-media-attachment-button-control-icon'
															})
													)
											)}
										</div>
									</button>
									<div ${ref(this.volumeControlRef)} class="discord-media-attachment-button-slider">
										<div class="discord-media-attachment-volume-vertical">
											<input
												${ref(this.volumeControlInputRef)}
												type="range"
												class="discord-media-attachment-volume-slider"
												@input=${this.handleVolumeSliderInput}
												max="100"
												value="100"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-voice-message': DiscordVoiceNote;
	}
}
