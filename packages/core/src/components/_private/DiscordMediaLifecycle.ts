import { LitElement, type PropertyValueMap } from 'lit';
import { state } from 'lit/decorators.js';
import { createRef, type Ref } from 'lit/directives/ref.js';
import type WaveSurfer from 'wavesurfer.js';

export class DiscordMediaLifecycle extends LitElement {
	protected mediaComponentRef: Ref<HTMLAudioElement | HTMLVideoElement> = createRef();

	protected seekSliderRef: Ref<HTMLInputElement> = createRef();

	protected volumeControlRef: Ref<HTMLDivElement> = createRef();

	protected volumeControlInputRef: Ref<HTMLInputElement> = createRef();

	@state()
	protected currentPlaybackPosition = '0:00';

	@state()
	protected leftPlaybackPosition = '0:00';

	@state()
	protected totalMediaDuration = '';

	@state()
	protected isPlaying = false;

	@state()
	private raf: number | null = null;

	@state()
	protected isMuted = false;

	/**
	 * Volume is a fractional value between 0 and 1
	 */
	@state()
	protected currentVolume = 1;

	@state()
	protected hasEnded = false;

	@state()
	private hasRunUpdate = false;

	protected calculateTime(secs: number) {
		const minutes = Math.floor(secs / 60);
		const seconds = Math.floor(secs % 60);
		const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
		// console.table({ returnedSeconds, minutes });
		return `${minutes}:${returnedSeconds}`;
	}

	protected displayMediaDuration() {
		if (this.mediaComponentRef.value) {
			this.totalMediaDuration = this.calculateTime(this.mediaComponentRef.value.duration);
		}
	}

	protected displayLeftPlaybackPosition(bufferedAmount: number) {
		if (this.mediaComponentRef.value && this.seekSliderRef.value) {
			this.leftPlaybackPosition = this.calculateTime(this.mediaComponentRef.value.duration - bufferedAmount);
		}
	}

	protected setSliderMax() {
		if (this.mediaComponentRef.value && this.seekSliderRef.value) {
			this.seekSliderRef.value.max = Math.floor(this.mediaComponentRef.value.duration).toString();
		}
	}

	protected displayBufferedAmount() {
		if (this.mediaComponentRef.value && this.seekSliderRef.value) {
			const newBufferedAmount = this.mediaComponentRef.value.buffered.length - 1;
			if (newBufferedAmount >= 0) {
				const bufferedAmount = Math.floor(this.mediaComponentRef.value.buffered.end(newBufferedAmount));
				this.style.setProperty('--buffered-width', `${(bufferedAmount / Number(this.seekSliderRef.value.max)) * 100}%`);
			}
		}
	}

	protected wavesurfer?: WaveSurfer | null = null;

	protected whilePlaying = () => {
		if (this.mediaComponentRef.value && this.seekSliderRef.value) {
			this.seekSliderRef.value.value = Math.floor(this.mediaComponentRef.value.currentTime).toString();
			const bufferedAmount = Number(this.seekSliderRef.value.value);
			this.currentPlaybackPosition = this.calculateTime(this.mediaComponentRef.value.currentTime);
			this.displayLeftPlaybackPosition(this.mediaComponentRef.value.currentTime);
			this.style.setProperty('--seek-before-width', `${(bufferedAmount / Number(this.seekSliderRef.value.max)) * 100}%`);
			this.raf = requestAnimationFrame(this.whilePlaying);
		}
	};

	protected handleEnded() {
		if (this.mediaComponentRef.value) {
			this.mediaComponentRef.value.pause();
			if (this.raf !== null) cancelAnimationFrame(this.raf);
			this.isPlaying = false;
			this.hasEnded = true;
		}
	}

	protected handleClickPlayPauseIcon() {
		if (this.mediaComponentRef.value) {
			if (this.hasEnded) this.hasEnded = false;

			if (this.isPlaying) {
				this.mediaComponentRef.value.pause();
				if (this.raf !== null) cancelAnimationFrame(this.raf);
				this.isPlaying = false;
			} else {
				void this.mediaComponentRef.value.play();
				requestAnimationFrame(this.whilePlaying);
				this.isPlaying = true;
			}
		}
	}

	protected handleSpaceToPlayPause = (event: KeyboardEvent) => {
		if (event.code === 'Space') {
			event.preventDefault();
			event.stopPropagation();

			this.handleClickPlayPauseIcon();
		}
	};

	protected handleClickMuteIcon() {
		if (this.mediaComponentRef.value) {
			const input = this.volumeControlInputRef.value;
			if (this.isMuted) {
				this.mediaComponentRef.value.muted = false;
				if (input) input.value = (this.currentVolume * 100).toString();
				this.isMuted = false;
			} else {
				this.mediaComponentRef.value.muted = true;
				this.isMuted = true;
				if (input) input.value = '0';
			}
		}
	}

	protected handleSeekSliderInput(event: Event) {
		const typedEventTarget = event.target as HTMLInputElement;

		this.style.setProperty('--seek-before-width', `${(Number(typedEventTarget.value) / Number(typedEventTarget.max)) * 100}%`);

		if (this.seekSliderRef.value) {
			this.currentPlaybackPosition = this.calculateTime(Number(this.seekSliderRef.value.value));
		}

		if (this.mediaComponentRef.value && !this.mediaComponentRef.value.paused && this.raf !== null) cancelAnimationFrame(this.raf);
	}

	protected handleSeekSliderChange = () => {
		if (this.mediaComponentRef.value && this.seekSliderRef.value) {
			this.mediaComponentRef.value.currentTime = Number(this.seekSliderRef.value.value);
			if (!this.mediaComponentRef.value.paused) {
				requestAnimationFrame(this.whilePlaying);
			}
		}
	};

	protected handleVolumeSliderInput(event: Event) {
		const typedEventTarget = event.target as HTMLInputElement;
		const { value } = typedEventTarget;

		this.isMuted = false;
		if (this.mediaComponentRef.value) this.mediaComponentRef.value.muted = false;

		if (this.mediaComponentRef.value) {
			const newVolume = Number(value) / 100;

			this.currentVolume = newVolume;
			this.mediaComponentRef.value.volume = newVolume;
		}
	}

	protected handleVolumeVerticalFocus() {
		this.addEventListener('keydown', this.handleVolumeControlKeyboard);
	}

	protected handleVolumeVerticalBlur() {
		this.removeEventListener('keydown', this.handleVolumeControlKeyboard);
	}

	protected handleVolumeControlKeyboard(event: KeyboardEvent) {
		let volumeChange = 0;
		if (event.code === 'ArrowDown') {
			volumeChange = -0.1;
		} else if (event.code === 'ArrowUp') {
			volumeChange = 0.1;
		}

		if (volumeChange !== 0) {
			this.adjustVolume(volumeChange, event);
		}
	}

	protected adjustVolume(change: number, event: KeyboardEvent) {
		event.preventDefault();
		event.stopPropagation();

		let newValue = this.currentVolume + change;

		if (newValue < 0.1) {
			newValue = 0;
		} else if (newValue > 1) {
			newValue = 1;
		}

		if (this.mediaComponentRef.value && this.volumeControlInputRef.value) {
			this.currentVolume = newValue;
			this.mediaComponentRef.value.volume = newValue;
			this.volumeControlInputRef.value.value = (newValue * 100).toString();
		}
	}

	protected mediaMetadataLoaded = () => {
		if (this.mediaComponentRef.value) {
			this.displayMediaDuration();
			this.setSliderMax();
			this.displayBufferedAmount();
		}
	};

	public override shouldUpdate(changedProperties: Map<PropertyKey, unknown> | PropertyValueMap<any>): boolean {
		if (changedProperties.has('hasRunUpdate') && changedProperties.size === 1) return false;

		return super.shouldUpdate(changedProperties);
	}

	public override firstUpdated(changedProperties: Map<PropertyKey, unknown>): void {
		if (!this.hasRunUpdate) {
			if (this.mediaComponentRef.value) {
				if (this.mediaComponentRef.value.readyState > 0) {
					this.displayMediaDuration();
					this.setSliderMax();
					this.displayBufferedAmount();
				} else {
					this.mediaComponentRef.value.addEventListener('loadedmetadata', this.mediaMetadataLoaded);
				}
			}

			this.hasRunUpdate = true;
			super.firstUpdated(changedProperties);
		}
	}

	public override disconnectedCallback(): void {
		super.disconnectedCallback();

		this.mediaComponentRef.value?.removeEventListener('loadedmetadata', this.mediaMetadataLoaded);
	}
}
