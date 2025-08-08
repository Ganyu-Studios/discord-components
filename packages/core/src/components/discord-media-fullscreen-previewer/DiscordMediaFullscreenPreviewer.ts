/* eslint-disable lit-a11y/click-events-have-key-events */
import { consume, provide } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { keyed } from 'lit/directives/keyed.js';
import { createRef, ref, type Ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import type { LightTheme, Profile } from '../../types.js';
import { isInMediaFullScreenPreviewer, type CloseFullScreenEventDetail } from '../_private/mediaGalleryFullScreenContext.js';
import '../discord-custom-emoji/DiscordCustomEmoji.js';
import { mediaItemsContext } from '../discord-media-gallery/DiscordMediaGallery.js';
import { DiscordMediaGalleryItem } from '../discord-media-gallery-item/DiscordMediaGalleryItem.js';
import { messageProfile, messageTimestamp } from '../discord-message/DiscordMessage.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';

export interface MediaItem {
	href: string;
	mimeType?: string | null;
}

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
const roundBySteps = (val: number, steps: number) => Math.round(val / steps) * steps;

const timeFormatter = new Intl.DateTimeFormat(void 0, {
	day: '2-digit',
	month: 'numeric',
	year: '2-digit',
	hour: 'numeric',
	minute: '2-digit',
	hourCycle: 'h23'
});

@customElement('discord-media-fullscreen-previewer')
export class DiscordMediaFullscreenPreviewer extends LitElement implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		.media-fullscreen-previewer {
			position: fixed;
			inset: 0;
			background-color: rgba(0, 0, 0, 0.92);
			display: grid;
			grid-template-rows: auto 1fr auto;
			gap: 8px;
			z-index: 2000;
			padding: 36px 24px;
			user-select: none;
			animation: fade-in 0.25s ease-out;

			--button-border-color: color-mix(in oklab, hsl(240 calc(1 * 4%) 60.784% /0.1607843137254902) 100%, hsl(0 0% 0% /0.1607843137254902) 0%);
			--button-color: color-mix(in oklab, hsl(232.5 calc(1 * 4.167%) 62.353% /1) 100%, #000 0%);
			--button-background-color: color-mix(in oklab, hsl(228 calc(1 * 6.849%) 14.314% /1) 100%, #000 0%);
			--button-hover-background-color: #2b2c30;
			--button-hover-color: color-mix(in oklab, hsl(240 calc(1 * 5.66%) 89.608% /1) 100%, #000 0%);

			&.closing {
				opacity: 0;
				transition: opacity 0.25s ease-out;
				pointer-events: none;

				* {
					pointer-events: none;
				}
			}

			discord-media-gallery-item {
				height: 100%;
			}

			header {
				height: 40px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: 8px;
				pointer-events: none;

				.author-info {
					pointer-events: auto;
					display: flex;
					align-items: center;
					gap: 12px;

					& > * {
						pointer-events: none;
					}

					img {
						border-radius: 50%;
					}

					& > div {
						display: flex;
						flex-direction: column;
						gap: 2px;

						span {
							line-height: 16px;
							font-size: 12px;
							color: color-mix(in oklab, hsl(233.333 calc(1 * 3.83%) 53.922% /1) 100%, #000 0%);
						}
					}
				}

				.media-actions {
					pointer-events: auto;
					display: flex;
					gap: 8px;

					.group-buttons-container {
						background-color: var(--button-background-color);
						border-radius: 8px;
						border: 1px solid var(--button-border-color);
						padding: 4px;
						display: flex;
						gap: 4px;

						button.btn {
							height: auto;
							min-height: unset;
							min-width: 30px;

							&:not(:hover) {
								--button-border-color: transparent;
							}
						}
					}

					button.btn {
						z-index: 1002;
					}
				}
			}

			button.btn {
				display: flex;
				cursor: pointer;
				justify-content: center;
				align-items: center;
				border: 1px solid var(--button-border-color);
				color: var(--button-color);
				background-color: var(--button-background-color);
				border-radius: 8px;
				padding: 4px;
				height: auto;
				min-height: 40px;
				min-width: 40px;
				transition:
					color 0.2s ease-in-out,
					background-color 0.2s ease-in-out;

				a {
					display: contents;
					color: inherit;
					text-decoration: none;
				}

				&:hover {
					background-color: var(--button-hover-background-color);
					color: var(--button-hover-color);
				}
			}

			main {
				align-self: stretch;
				overflow: hidden;
				display: grid;
				grid-template-columns: auto 1fr auto;
				grid-template-rows: 1fr;
				gap: 12px;
				pointer-events: none;

				button {
					pointer-events: auto;
				}

				.button-container {
					display: flex;
					justify-content: center;
					align-items: center;
				}

				.current-media-container {
					display: flex;
					justify-content: center;
					align-items: center;
					overflow: hidden;
					pointer-events: none;

					img {
						max-height: 100%;
						max-width: 100%;
						display: block;
						object-fit: contain;
						animation: fade-in 0.25s ease-out;
						cursor: zoom-in;
					}

					discord-video-attachment {
						animation: fade-in 0.25s ease-out;
					}

					img,
					discord-video-attachment {
						pointer-events: auto;
					}
				}
			}

			nav {
				display: flex;
				justify-content: center;
				align-items: center;
				pointer-events: none;
				.items-navigation-container {
					pointer-events: auto;
					display: flex;
					height: 40px;
					gap: 2px;
					align-items: center;
					justify-content: center;
					border-radius: 8px;
					overflow: hidden;
					button {
						width: 40px;
						height: 40px;
						padding: 0;
						border: none;
						margin: 0;
						border-radius: 2px;
						overflow: hidden;
						opacity: 0.5;
						transition: opacity 100ms ease-in-out;
						cursor: pointer;

						&.selected {
							opacity: 1;
						}

						img,
						video {
							width: 100%;
							height: 100%;
							object-fit: cover;
						}
					}
				}
			}

			&.zoomed {
				nav,
				header :where(.author-info, .group-buttons-container),
				main button {
					opacity: 0;
					pointer-events: none !important;
				}

				main {
					overflow: hidden;

					.current-media-container:has(img.current-image-preview) {
						width: var(--img-width, unset);
						height: var(--img-height, unset);
						scale: var(--scale);

						position: fixed;

						left: 50%;
						top: 50%;
						transform-origin: center center;

						--target-x: -50%;
						--target-y: -50%;

						translate: var(--target-x, 0%) var(--target-y, 0%);

						&.can-be-x-draggable {
							--target-width: calc(var(--img-width, unset) * var(--scale));
							--x-screen-overflow: calc((var(--target-width) - 100vw) / 2);
							--target-x: calc(clamp(calc(var(--x-screen-overflow) * -1), var(--x, 0%), var(--x-screen-overflow)) - 50%);
						}

						&.can-be-y-draggable {
							--target-height: calc(var(--img-height, unset) * var(--scale));
							--y-screen-overflow: calc((var(--target-height) - 100vh) / 2);
							--target-y: calc(clamp(calc(var(--y-screen-overflow) * -1), var(--y, 0%), var(--y-screen-overflow)) - 50%);
						}

						img {
							cursor: zoom-out;
						}
					}
				}
			}

			nav,
			header :where(.author-info, .group-buttons-container),
			main button {
				transition: opacity 100ms ease-in-out;
			}

			&.isOnlyOne {
				main .btn {
					opacity: 0;
					pointer-events: none !important;
				}

				nav {
					opacity: 0;
					pointer-events: none !important;
				}
			}
		}

		@keyframes fade-in {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
	`;

	public constructor() {
		super();
		this.handleWindowResize = this.handleWindowResize.bind(this);
	}

	@provide({ context: isInMediaFullScreenPreviewer })
	public isInMediaFullScreenPreviewer = true;

	@state()
	public isZoomed = false;

	private __currentXTranslatePercent = 0;

	private __currentYTranslatePercent = 0;

	private __draggCurrentXTranslatePercent = 0;

	private __draggCurrentYTranslatePercent = 0;

	private __didDrag = false;

	private __scale = 1;

	private clampXTranslatePercentPosition(val: number) {
		return clamp(val, -this.__maxXTranslatePercent, this.__maxXTranslatePercent);
	}

	private clampYTranslatePercentPosition(val: number) {
		return clamp(val, -this.__maxYTranslatePercent, this.__maxYTranslatePercent);
	}

	private imageRef = createRef<HTMLImageElement>();

	private calcScale() {
		if (!this.imageRef.value) return 1;

		const rect = this.imageRef.value.getBoundingClientRect();

		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		const screenArea = screenWidth * screenHeight;
		const targetArea = rect.width * rect.height;
		const areaProportion = targetArea / screenArea;
		const scale = clamp(roundBySteps(areaProportion * 8, 2), 2, 4);

		this.__scale = scale;

		return this.__scale;
	}

	private __canBeXDraggable = false;

	private __canBeYDraggable = false;

	private get __canBeDraggable() {
		return this.__canBeXDraggable || this.__canBeYDraggable;
	}

	private __maxXTranslatePercent = 0;

	private __maxYTranslatePercent = 0;

	private calcCanBeDraggable(skipZoomedCheck = false) {
		if (!skipZoomedCheck && !this.isZoomed) return;
		if (!this.imageRef.value) return;

		const target = this.imageRef.value;

		this.__canBeXDraggable = target.clientWidth * this.__scale > window.innerWidth;
		this.__canBeYDraggable = target.clientHeight * this.__scale > window.innerHeight;

		const targetWidth = target.clientWidth * this.__scale;
		const targetHeight = target.clientHeight * this.__scale;

		const overflowX = (targetWidth - window.innerWidth) / 2;
		const overflowY = (targetHeight - window.innerHeight) / 2;

		this.__maxXTranslatePercent = (overflowX / target.clientWidth) * 100;
		this.__maxYTranslatePercent = (overflowY / target.clientHeight) * 100;

		this.__currentXTranslatePercent = this.__canBeXDraggable ? this.clampXTranslatePercentPosition(this.__currentXTranslatePercent) : 0;
		this.__currentYTranslatePercent = this.__canBeYDraggable ? this.clampYTranslatePercentPosition(this.__currentYTranslatePercent) : 0;
		this.__draggCurrentXTranslatePercent = this.__currentXTranslatePercent;
		this.__draggCurrentYTranslatePercent = this.__currentYTranslatePercent;

		target.parentElement?.style.setProperty('--x', `${this.__currentXTranslatePercent}%`);
		target.parentElement?.style.setProperty('--y', `${this.__currentYTranslatePercent}%`);

		if (this.__canBeXDraggable) target.parentElement?.classList.add('can-be-x-draggable');
		else target.parentElement?.classList.remove('can-be-x-draggable');

		if (this.__canBeYDraggable) target.parentElement?.classList.add('can-be-y-draggable');
		else target.parentElement?.classList.remove('can-be-y-draggable');
	}

	private zoomIn() {
		if (this.isZoomed || !this.imageRef.value) return;
		this.calcScale();
		this.calcCanBeDraggable();
		const target = this.imageRef.value;

		const currentWidth = target.clientWidth;
		const currentHeight = target.clientHeight;

		target.parentElement?.style.setProperty('--img-width', `${currentWidth}px`);
		target.parentElement?.style.setProperty('--img-height', `${currentHeight}px`);
		target.parentElement?.style.setProperty('--scale', `${this.__scale}`);
		target.parentElement?.style.setProperty('--x', `0%`);
		target.parentElement?.style.setProperty('--y', `0%`);

		this.__currentXTranslatePercent = 0;
		this.__currentYTranslatePercent = 0;
		this.__draggCurrentXTranslatePercent = 0;
		this.__draggCurrentYTranslatePercent = 0;

		this.isZoomed = true;
	}

	private handleWindowResize() {
		this.calcCanBeDraggable();
	}

	public handleImageClick(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();

		if (this.isZoomed) {
			if (this.__didDrag) {
				this.__didDrag = false;
				return;
			}

			window.removeEventListener('resize', this.handleWindowResize);
			this.isZoomed = false;
			return;
		}

		const target = event.target as HTMLElement;
		const percentX = (event.offsetX / target.clientWidth) * 100;
		const percentY = (event.offsetY / target.clientHeight) * 100;

		const currentWidth = target.clientWidth;
		const currentHeight = target.clientHeight;

		this.calcScale();

		const x = this.__canBeXDraggable ? this.clampXTranslatePercentPosition((50 - percentX) * this.__scale) : 0;
		const y = this.__canBeYDraggable ? this.clampYTranslatePercentPosition((50 - percentY) * this.__scale) : 0;

		this.__currentXTranslatePercent = x;
		this.__currentYTranslatePercent = y;
		this.__draggCurrentXTranslatePercent = x;
		this.__draggCurrentYTranslatePercent = y;

		target.parentElement?.style.setProperty('--x', `${x}%`);
		target.parentElement?.style.setProperty('--y', `${y}%`);
		target.parentElement?.style.setProperty('--scale', `${this.__scale}`);
		target.parentElement?.style.setProperty('--img-width', `${currentWidth}px`);
		target.parentElement?.style.setProperty('--img-height', `${currentHeight}px`);

		this.isZoomed = true;
		this.calcCanBeDraggable(true);

		window.addEventListener('resize', this.handleWindowResize);
	}

	public handleImageMouseMove(event: MouseEvent) {
		event.stopPropagation();
		event.preventDefault();
		if (!this.downEvent || event.buttons !== 1 || !this.__canBeDraggable) return;

		this.__didDrag = true;

		const diffX = event.screenX - this.downEvent.screenX;
		const diffY = event.screenY - this.downEvent.screenY;

		const target = event.target as HTMLElement;
		const rect = target.getBoundingClientRect();

		const xPercent = (diffX / rect.width) * 100 * this.__scale;
		const yPercent = (diffY / rect.height) * 100 * this.__scale;

		const x = this.__canBeXDraggable ? this.clampXTranslatePercentPosition(this.__currentXTranslatePercent + xPercent) : 0;
		const y = this.__canBeYDraggable ? this.clampYTranslatePercentPosition(this.__currentYTranslatePercent + yPercent) : 0;

		this.__draggCurrentXTranslatePercent = x;
		this.__draggCurrentYTranslatePercent = y;

		target.parentElement?.style.setProperty('--x', `${x}%`);
		target.parentElement?.style.setProperty('--y', `${y}%`);
	}

	private downEvent: MouseEvent | undefined;

	public handleImageMouseDown(event: MouseEvent) {
		if (event.buttons !== 1) return;
		this.__currentXTranslatePercent = this.__draggCurrentXTranslatePercent;
		this.__currentYTranslatePercent = this.__draggCurrentYTranslatePercent;
		this.downEvent = this.isZoomed ? event : undefined;
	}

	public handleImageMouseUp(event: MouseEvent) {
		event.stopPropagation();
		event.preventDefault();
		this.__currentXTranslatePercent = this.__draggCurrentXTranslatePercent;
		this.__currentYTranslatePercent = this.__draggCurrentYTranslatePercent;

		this.downEvent = undefined;
	}

	public handleImageWheel(event: WheelEvent) {
		event.stopPropagation();
		event.preventDefault();
		if (!this.isZoomed || !this.__canBeDraggable) return;

		const notHasDeltaX = event.deltaX === 0;
		const percentY = (event.deltaY / 10) * -1;
		const percentX = (event.deltaX / 10) * -1;

		const isHorizontalScroll = notHasDeltaX && event.shiftKey;

		const y = this.__canBeYDraggable
			? this.clampYTranslatePercentPosition(this.__currentYTranslatePercent + (isHorizontalScroll ? 0 : percentY))
			: 0;
		const x = this.__canBeYDraggable
			? this.clampXTranslatePercentPosition(this.__currentXTranslatePercent + (isHorizontalScroll ? percentY : percentX))
			: 0;

		this.__draggCurrentYTranslatePercent = y;
		this.__currentYTranslatePercent = y;

		this.__draggCurrentXTranslatePercent = x;
		this.__currentXTranslatePercent = x;

		const target = event.target as HTMLElement;
		target.parentElement?.style.setProperty('--y', `${y}%`);
		target.parentElement?.style.setProperty('--x', `${x}%`);
	}

	public override disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('resize', this.handleWindowResize);
		window.clearTimeout(this.__closeTimeout);
	}

	@consume({ context: messagesLightTheme, subscribe: true })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public lightTheme = false;

	@consume({ context: mediaItemsContext, subscribe: true })
	@state()
	public mediaItems: MediaItem[];

	@consume({ context: messageProfile, subscribe: true })
	public profile: Profile | undefined;

	@consume({ context: messageTimestamp, subscribe: true })
	public timestamp: string | undefined;

	@state()
	public currentSlot = 0;

	@state()
	public isOpen = false;

	public nextSlot() {
		const next = this.currentSlot + 1;
		if (next > this.mediaItems.length - 1) {
			this.currentSlot = 0;
			return;
		}

		this.currentSlot = next;
		this.isZoomed = false;
	}

	public prevSlot() {
		const prev = this.currentSlot - 1;

		if (prev < 0) {
			this.currentSlot = this.mediaItems.length - 1;
			return;
		}

		this.currentSlot = prev;
		this.isZoomed = false;
	}

	public setCurrentSlot(slot: number) {
		this.currentSlot = slot;
	}

	private handleContainerKeyUp(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			this.prevSlot();
		} else if (event.key === 'ArrowRight') {
			this.nextSlot();
		} else if (event.key === 'Escape') {
			this.close();
		}
	}

	private containerRef: Ref<HTMLDivElement> = createRef();

	private isCurrentlyClosing = false;

	public close() {
		if (!this.isOpen || this.isCurrentlyClosing) return;
		this.isCurrentlyClosing = true;
		const container = this.containerRef.value;
		container?.classList.add('closing');
		this.__closeTimeout = window.setTimeout(() => {
			this.isOpen = false;
			this.isZoomed = false;

			const event = new CustomEvent<CloseFullScreenEventDetail>('close-full-screen', {
				detail: {
					closed: true
				}
			});

			this.dispatchEvent(event);
			this.isCurrentlyClosing = false;
		}, 250);
	}

	private __closeTimeout: number | undefined;

	private handleContainerClick(event: MouseEvent) {
		const container = this.containerRef.value;
		if (!container || event.target !== container) return;
		this.close();
	}

	protected override render() {
		if (!this.isOpen) return null;

		const currentSlot = this.mediaItems[clamp(this.currentSlot, 0, this.mediaItems.length - 1)];
		const isVideo = DiscordMediaGalleryItem.isVideo(currentSlot.href, currentSlot.mimeType);

		const isOnlyOne = this.mediaItems.length === 1;

		return html`
			<div
				class=${classMap({
					'media-fullscreen-previewer': true,
					zoomed: this.isZoomed,
					isOnlyOne
				})}
				${ref(this.containerRef)}
				tabindex="-1"
				@click=${this.handleContainerClick}
				@keyup=${this.handleContainerKeyUp}
			>
				<header>
					<div class="author-info">
						<img width="40" height="40" src=${ifDefined(this.profile?.avatar)} alt="avatar" />
						<div>
							${when(
								this.profile,
								() => html`
									<discord-author-info
										author=${this.profile!.author ?? ''}
										?bot=${this.profile!.bot ?? false}
										?server=${this.profile!.server ?? false}
										?official-app=${this.profile!.officialApp ?? false}
										?verified=${this.profile!.verified ?? false}
										?op=${this.profile!.op ?? false}
										role-color=${this.profile!.roleColor ?? ''}
										role-icon=${this.profile!.roleIcon ?? ''}
										role-name=${this.profile!.roleName ?? ''}
										clan-icon=${this.profile!.clanIcon ?? ''}
										clan-tag=${this.profile!.clanTag ?? ''}
									></discord-author-info>
								`
							)}
							<span class="timestamp">${timeFormatter.format(this.timestamp ? new Date(this.timestamp) : new Date())}</span>
						</div>
					</div>
					<div class="media-actions">
						<div class="group-buttons-container">
							${when(
								!isVideo,
								() =>
									html`<button class="btn" @click=${this.zoomIn}>
										<svg
											aria-hidden="true"
											role="img"
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
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
											<path
												fill="currentColor"
												d="M11 7a1 1 0 1 0-2 0v2H7a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2V7Z"
												class=""
											></path>
										</svg>
									</button>`
							)}
							<button class="btn">
								<a href=${currentSlot.href} target="_blank">
									<svg
										aria-hidden="true"
										role="img"
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										fill="none"
										viewBox="0 0 24 24"
									>
										<path
											fill="currentColor"
											d="M15 2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V4.41l-4.3 4.3a1 1 0 1 1-1.4-1.42L19.58 3H16a1 1 0 0 1-1-1Z"
											class=""
										></path>
										<path
											fill="currentColor"
											d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 1 0-2 0v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 1 0 0-2H5Z"
											class=""
										></path>
									</svg>
								</a>
							</button>
						</div>
						<button class="btn" @click=${this.close}>
							<svg
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
							</svg>
						</button>
					</div>
				</header>
				<main>
					<div class="button-container">
						<button @click=${this.prevSlot} class="btn">
							<svg
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
									d="M3.3 11.3a1 1 0 0 0 0 1.4l8 8a1 1 0 1 0 1.4-1.4L6.42 13H20a1 1 0 1 0 0-2H6.41l6.3-6.3a1 1 0 0 0-1.42-1.4l-8 8Z"
									class=""
								></path>
							</svg>
						</button>
					</div>
					<div class="current-media-container">
						${keyed(
							currentSlot.href,
							when(
								isVideo,
								() => html`<discord-video-attachment href=${currentSlot.href}></discord-video-attachment>`,
								() =>
									html`<img
										${ref(this.imageRef)}
										@wheel=${this.handleImageWheel}
										@mousemove=${this.handleImageMouseMove}
										@mouseup=${this.handleImageMouseUp}
										@mousedown=${this.handleImageMouseDown}
										@click=${this.handleImageClick}
										draggable="false"
										src=${currentSlot.href}
										alt=${currentSlot.href}
										class="current-image-preview"
									/>`
							)
						)}
					</div>
					<div class="button-container">
						<button @click=${this.nextSlot} class="btn">
							<svg
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
									d="M20.7 12.7a1 1 0 0 0 0-1.4l-8-8a1 1 0 1 0-1.4 1.4l6.29 6.3H4a1 1 0 1 0 0 2h13.59l-6.3 6.3a1 1 0 0 0 1.42 1.4l8-8Z"
									class=""
								></path>
							</svg>
						</button>
					</div>
				</main>
				<nav>
					<div class="items-navigation-container">
						${this.mediaItems.map((item, idx) => {
							const isVideo = DiscordMediaGalleryItem.isVideo(item.href, item.mimeType);
							return html`<button @click=${() => this.setCurrentSlot(idx)} class=${classMap({ selected: this.currentSlot === idx })}>
								${when(
									isVideo,
									() => html`<video src=${item.href} alt=${item.href}></video>`,
									() => html`<img src=${item.href} alt=${item.href} />`
								)}
							</button>`;
						})}
					</div>
				</nav>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-media-fullscreen-previewer': DiscordMediaFullscreenPreviewer;
	}
}
