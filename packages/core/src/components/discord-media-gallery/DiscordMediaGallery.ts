import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import '../discord-custom-emoji/DiscordCustomEmoji.js';

const withWrapper = (val: unknown) => html`<div class="discord-media-gallery-wrapper">${val}</div>`;

@customElement('discord-media-gallery')
export class DiscordMediaGallery extends LitElement {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		.discord-media-gallery-wrapper {
			display: flex;
			gap: 4px;
			border-radius: 8px;
			overflow: hidden;
			width: min(100%, 600px);
			align-items: stretch;
			justify-content: stretch;
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
				width: unset;
				height: unset;
				border-radius: 8px;
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
	`;

	@property({ type: Number, attribute: false })
	public accessor size = 0;

	protected override updated() {
		const items = this.querySelectorAll('discord-media-gallery-item');

		if (this.size === items.length) return;
		this.size = items.length;

		for (const [idx, item] of items.entries()) {
			item.setAttribute('slot', `image-${idx + 1}`);
		}
	}

	protected override render() {
		return choose(
			this.size,
			[
				[1, () => html` <slot name="image-1" class="discord-media-gallery-unique-display-grid"></slot> `],
				[
					2,
					() =>
						withWrapper(html`
							<div class="discord-media-gallery-second-display-grid">
								<div class="discord-media-gallery-display-top">
									<slot name="image-1"></slot>
									<slot name="image-2"></slot>
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
									<slot name="image-1"></slot>
								</div>
								<div class="discord-media-gallery-vertical-grid">
									<slot name="image-2"></slot>
									<slot name="image-3"></slot>
								</div>
							</div>
						`)
				],
				[
					4,
					() =>
						withWrapper(html`
							<div class="discord-media-gallery-four-display-grid">
								<slot name="image-1"></slot>
								<slot name="image-2"></slot>
								<slot name="image-3"></slot>
								<slot name="image-4"></slot>
							</div>
						`)
				],
				[
					5,
					() =>
						withWrapper(html`
							<div class="discord-media-gallery-five-display-grid">
								<div class="discord-media-gallery-display-top">
									<slot name="image-1"></slot>
									<slot name="image-2"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="image-3"></slot>
									<slot name="image-4"></slot>
									<slot name="image-5"></slot>
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
									<slot name="image-1"></slot>
									<slot name="image-2"></slot>
									<slot name="image-3"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="image-4"></slot>
									<slot name="image-5"></slot>
									<slot name="image-6"></slot>
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
									<slot name="image-1"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="image-2"></slot>
									<slot name="image-3"></slot>
									<slot name="image-4"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="image-5"></slot>
									<slot name="image-6"></slot>
									<slot name="image-7"></slot>
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
									<slot name="image-1"></slot>
									<slot name="image-2"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="image-3"></slot>
									<slot name="image-4"></slot>
									<slot name="image-5"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="image-6"></slot>
									<slot name="image-7"></slot>
									<slot name="image-8"></slot>
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
									<slot name="image-1"></slot>
									<slot name="image-2"></slot>
									<slot name="image-3"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="image-4"></slot>
									<slot name="image-5"></slot>
									<slot name="image-6"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="image-7"></slot>
									<slot name="image-8"></slot>
									<slot name="image-9"></slot>
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
									<slot name="image-1"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="image-2"></slot>
									<slot name="image-3"></slot>
									<slot name="image-4"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="image-5"></slot>
									<slot name="image-6"></slot>
									<slot name="image-7"></slot>
								</div>
								<div class="discord-media-gallery-three-horizontal-mosaics">
									<slot name="image-8"></slot>
									<slot name="image-9"></slot>
									<slot name="image-10"></slot>
								</div>
							</div>
						`)
				]
			],
			() => html`<discord-header>Invalid Media Gallery, items must be in 1-10 range.</discord-header>`
		);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-media-gallery': DiscordMediaGallery;
	}
}
