import { createContext, provide } from '@lit/context';
import { css, html, LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import '../discord-custom-emoji/DiscordCustomEmoji.js';
import { type CloseFullScreenEventDetail, type OpenInFullScreenEventDetail } from '../_private/mediaGalleryFullScreenContext.js';
import type { MediaItem } from '../discord-media-fullscreen-previewer/DiscordMediaFullscreenPreviewer.js';

const withWrapper = (val: unknown) => html`<div class="discord-media-gallery-wrapper">${val}</div>`;

export const mediaItemsContext = createContext<MediaItem[]>(Symbol('media-items-list'));

@customElement('discord-media-gallery')
export class DiscordMediaGallery extends LitElement {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		.discord-media-gallery-wrapper {
			display: flex;
			gap: 4px;
			border-radius: 6px;
			overflow: hidden;
			width: min(100%, 600px);
			align-items: stretch;
			justify-content: stretch;
		}
		:host {
			width: fit-content;
			height: fit-content;
		}

		.event-container {
			display: contents;
		}

		.discord-media-gallery-vertical-grid {
			display: flex;
			flex: 1;
			gap: 4px;
			flex-direction: column;
		}

		.discord-media-gallery-three-display-grid {
			display: flex;
			flex: 1;
			gap: 4px;
			align-items: stretch;
			flex: 1;
			height: 350px;
		}

		.discord-media-gallery-four-display-grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			grid-template-rows: repeat(2, minmax(0, 1fr));
			flex: 1;
			height: 350px;
			gap: 4px;
		}

		.discord-media-gallery-five-display-grid,
		.discord-media-gallery-six-display-grid,
		.discord-media-gallery-seven-display-grid,
		.discord-media-gallery-eight-display-grid,
		.discord-media-gallery-nine-display-grid,
		.discord-media-gallery-ten-display-grid,
		.discord-media-gallery-second-display-grid {
			display: flex;
			gap: 4px;
			flex-direction: column;
			flex: 1;
		}

		.discord-media-gallery-display-top {
			display: flex;
			gap: 4px;
			height: 280px;
		}

		.discord-media-gallery-three-horizontal-mosaics {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 4px;
			aspect-ratio: 3 / 1;
		}

		.discord-media-gallery-unique-display-grid {
			&::slotted(discord-media-gallery-item) {
				width: fit-content;
				height: fit-content;
				border-radius: 6px;
				max-width: min(100%, 600px);
				--img-width: auto;
				--img-height: auto;
				--img-max-width: 100%;
				--img-max-height: 350px;
			}
		}

		.flex-2 {
			flex: 2;
		}

		.open-in-fullscreen-container {
			display: grid;
		}
	`;

	public constructor() {
		super();
		this.setFullScreenSlotTarget = this.setFullScreenSlotTarget.bind(this);
	}

	@property({ type: Number, attribute: false })
	public size = 0;

	@provide({ context: mediaItemsContext })
	public mediaItems: MediaItem[];

	@state()
	public currentSlot = 0;

	@state()
	public isOpen = false;

	public setFullScreenSlotTarget(event: CustomEvent<OpenInFullScreenEventDetail>) {
		this.currentSlot = event.detail.slot;
		this.isOpen = true;
	}

	private handleCloseFullScreen(_: CustomEvent<CloseFullScreenEventDetail>) {
		this.isOpen = false;
		this.currentSlot = 0;
	}

	protected override updated(changed: PropertyValues) {
		if (changed.has('mediaItems') || (changed.has('size') && changed.get('size') !== undefined)) return;

		const items = this.querySelectorAll('discord-media-gallery-item');

		if (this.size === items.length) return;
		this.size = items.length;

		const mediaItems: MediaItem[] = [];

		for (const [idx, item] of items.entries()) {
			item.setAttribute('slot', `media-${idx + 1}`);
			const href = item.getAttribute('media');
			if (!href) continue;
			mediaItems.push({ href, mimeType: item.getAttribute('mime-type') });
		}

		this.mediaItems = mediaItems;
	}

	protected override render() {
		const base = choose(
			this.size,
			[
				[1, () => html` <slot name="media-1" class="discord-media-gallery-unique-display-grid"></slot> `],
				[
					2,
					() =>
						withWrapper(html`
							<div class="discord-media-gallery-second-display-grid">
								<div class="discord-media-gallery-display-top">
									<slot name="media-1"></slot>
									<slot name="media-2"></slot>
								</div>
							</div>
						`)
				],
				[
					3,
					() =>
						withWrapper(html`
							<div class="discord-media-gallery-three-display-grid">
								<div class="flex-2">
									<slot name="media-1"></slot>
								</div>
								<div class="discord-media-gallery-vertical-grid">
									<slot name="media-2"></slot>
									<slot name="media-3"></slot>
								</div>
							</div>
						`)
				],
				[
					4,
					() =>
						withWrapper(html`
							<div class="discord-media-gallery-four-display-grid">
								<slot name="media-1"></slot>
								<slot name="media-2"></slot>
								<slot name="media-3"></slot>
								<slot name="media-4"></slot>
							</div>
						`)
				],
				[
					5,
					() =>
						withWrapper(html`
							<div class="discord-media-gallery-five-display-grid">
								<div class="discord-media-gallery-display-top">
									<slot name="media-1"></slot>
									<slot name="media-2"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="media-3"></slot>
									<slot name="media-4"></slot>
									<slot name="media-5"></slot>
								</div>
							</div>
						`)
				],
				[
					6,
					() =>
						withWrapper(html`
							<div class="discord-media-gallery-six-display-grid">
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="media-1"></slot>
									<slot name="media-2"></slot>
									<slot name="media-3"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="media-4"></slot>
									<slot name="media-5"></slot>
									<slot name="media-6"></slot>
								</div>
							</div>
						`)
				],
				[
					7,
					() =>
						withWrapper(html`
							<div class="discord-media-gallery-seven-display-grid">
								<div class="discord-media-gallery-display-top">
									<slot name="media-1"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="media-2"></slot>
									<slot name="media-3"></slot>
									<slot name="media-4"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="media-5"></slot>
									<slot name="media-6"></slot>
									<slot name="media-7"></slot>
								</div>
							</div>
						`)
				],
				[
					8,
					() =>
						withWrapper(html`
							<div class="discord-media-gallery-eight-display-grid">
								<div class="discord-media-gallery-display-top">
									<slot name="media-1"></slot>
									<slot name="media-2"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="media-3"></slot>
									<slot name="media-4"></slot>
									<slot name="media-5"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="media-6"></slot>
									<slot name="media-7"></slot>
									<slot name="media-8"></slot>
								</div>
							</div>
						`)
				],
				[
					9,
					() =>
						withWrapper(html`
							<div class="discord-media-gallery-nine-display-grid">
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="media-1"></slot>
									<slot name="media-2"></slot>
									<slot name="media-3"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="media-4"></slot>
									<slot name="media-5"></slot>
									<slot name="media-6"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="media-7"></slot>
									<slot name="media-8"></slot>
									<slot name="media-9"></slot>
								</div>
							</div>
						`)
				],
				[
					10,
					() =>
						withWrapper(html`
							<div class="discord-media-gallery-ten-display-grid">
								<div class="discord-media-gallery-display-top">
									<slot name="media-1"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="media-2"></slot>
									<slot name="media-3"></slot>
									<slot name="media-4"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="media-5"></slot>
									<slot name="media-6"></slot>
									<slot name="media-7"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="media-8"></slot>
									<slot name="media-9"></slot>
									<slot name="media-10"></slot>
								</div>
							</div>
						`)
				]
			],
			() => html`<discord-header>Invalid Media Gallery, items must be in 1-10 range.</discord-header>`
		);

		return html`
			<div @open-in-full-screen=${this.setFullScreenSlotTarget} class="open-in-fullscreen-container">${base}</div>
			<discord-media-fullscreen-previewer
				@close-full-screen=${this.handleCloseFullScreen}
				.currentSlot=${this.currentSlot}
				.isOpen=${this.isOpen}
			></discord-media-fullscreen-previewer>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-media-gallery': DiscordMediaGallery;
	}
}
