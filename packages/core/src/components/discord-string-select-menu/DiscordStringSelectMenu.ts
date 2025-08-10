/* eslint-disable lit-a11y/click-events-have-key-events */
import { consume } from '@lit/context';
import { css, html, LitElement } from 'lit';
import { customElement, eventOptions, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import type { LightTheme } from '../../types.js';
import type { BaseDiscordSelectMenuOption } from '../_private/BaseDiscordSelectMenuOption.js';
import { messagesLightTheme } from '../discord-messages/DiscordMessages.js';
import ExpandMore from '../svgs/ExpandMore.js';
import ModalClose from '../svgs/ModalClose.js';

@customElement('discord-string-select-menu')
export class DiscordStringSelectMenu extends LitElement implements LightTheme {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		.discord-string-select-menu {
			height: 46px;
			min-height: 36px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			cursor: pointer;
			color: color-mix(in oklab, hsl(210 calc(1 * 9.1%) 87.1% / 1) 100%, black 0%);
			border: 1px solid;
			border-radius: 8px;
			background-color: #28292e;
			border-color: #3e3f44;
			padding: 8px !important;
			width: 90%;
			max-width: 400px;
			margin-right: 16px;
			transition: border 0.2s ease;
			font-weight: 500;
		}

		:host {
			user-select: none;
		}

		:host([light-theme]) .discord-string-select-menu {
			background-color: #ebebeb !important;
			border-color: #b5b5b5 !important;
			border: 1px solid;
			color: #2e3338;
		}

		:host([light-theme]) .discord-string-select-menu-option-slot {
			background-color: #ebebeb !important;
			border-color: #b5b5b5 !important;
			border: 1px solid;
			color: #2e3338;
		}

		.discord-string-select-menu-option-slot {
			margin-top: 4px;
			overflow-y: auto;
			overflow-x: hidden;
			color: currentColor;
			border: 1px solid;
			border-radius: 8px;
			border-color: #474850;
			background-color: #3c3d45;
			cursor: pointer;
			box-sizing: border-box;
			gap: 10px;
			display: block;
			max-height: 190px;
			position: absolute;
			width: 90%;
			max-width: 400px;
			z-index: 1002;
		}

		.discord-string-select-menu-option-slot::-webkit-scrollbar {
			width: 5px;
			background-color: transparent;
		}

		.discord-string-select-menu-option-slot::-webkit-scrollbar-track {
			background-color: transparent;
		}

		.discord-string-select-menu-option-slot::-webkit-scrollbar-thumb {
			border-radius: 10px;
			background-color: rgba(0, 0, 0, 0.3);
		}

		.discord-string-select-menu-label {
			width: 100%;
		}

		.discord-string-select-inside-menu {
			padding: 8px 8px 8px 12px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.discord-string-select-menu-hidden {
			display: none;
		}

		.discord-string-select-menu-disabled {
			cursor: not-allowed !important;
			opacity: 0.5;
		}

		.discord-string-select-inside-menu:hover {
			border-color: black;
			cursor: pointer;
		}

		.discord-string-select-menu-rotated {
			transform: rotate(-180deg);
		}

		.discord-expand-more-icon {
			margin-left: auto;
		}

		.discord-clear-input-button {
			appearance: none;
			border: none;
			height: 16px;
			outline: none;
			background-color: transparent;
			cursor: pointer;
			padding: 0;
			margin: 0;
			color: currentColor;
			svg {
				width: 16px;
				height: 16px;
				fill: currentColor;
				path {
					fill: currentColor;
				}
			}
		}

		.discord-buttons-container {
			display: flex;
			align-items: center;
			gap: 4px;
		}

		.search-input {
			flex: 1;
			border: none;
			outline: none;
			background-color: transparent;
			color: currentColor;
			appearance: none;
			font-size: 16px;
		}

		center {
			height: 46px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	`;

	public constructor() {
		super();
		this.handleWindowClickOutsideEvent = this.handleWindowClickOutsideEvent.bind(this);
	}

	public withSearch = false;

	/**
	 * Whether to show the `discord-string-select-menu` as disabled.
	 */
	@property({ type: Boolean, attribute: 'disabled' })
	public disabled: boolean;

	/**
	 * The placeholder of the select-menu
	 */
	@property({ attribute: 'placeholder' })
	public placeholder: string = 'Make a selection';

	@consume({ context: messagesLightTheme })
	@property({ type: Boolean, reflect: true, attribute: 'light-theme' })
	public lightTheme = false;

	@state()
	private __previousSelectedNode?: BaseDiscordSelectMenuOption;

	public selectOption(selectedOption?: BaseDiscordSelectMenuOption) {
		const node = selectedOption?.cloneNode(true) as BaseDiscordSelectMenuOption | undefined;

		if (node) {
			node.slot = 'default';
			node.selected = false;
			this.append(node);
			this.doVisibleAllOptions();
		}

		this.__previousSelectedNode?.remove();
		this.__previousSelectedNode = node;

		if (!this.options) return;
		for (const option of this.options) {
			if (option === selectedOption) option.selected = true;
			else option.selected = false;
		}
	}

	public options?: NodeListOf<BaseDiscordSelectMenuOption>;

	public override connectedCallback() {
		super.connectedCallback();
		this.options = this.querySelectorAll(
			'discord-string-select-menu-option, discord-user-select-menu-option, discord-role-select-menu-option, discord-channel-select-menu-option'
		) as NodeListOf<BaseDiscordSelectMenuOption>;

		for (const option of this.options) {
			if (option.selected) {
				this.selectOption(option);
				break;
			}
		}

		this.doVisibleAllOptions();
	}

	public static currentOpenInstance: DiscordStringSelectMenu | undefined;

	@state()
	private noResultsFound = false;

	@state()
	private isSearching = false;

	public handleInput(input: string) {
		const search = input.toLowerCase() as Lowercase<string>;
		this.isSearching = search.trim().length > 0;
		if (!this.options) return;
		let visibleOptions = 0;
		for (const option of this.options) {
			option.visible = option.filter(search);
			if (option.visible) visibleOptions++;
		}

		this.noResultsFound = visibleOptions === 0;
	}

	private doVisibleAllOptions() {
		if (!this.options) return;
		for (const option of this.options) {
			option.visible = true;
		}

		this.noResultsFound = false;
	}

	private inputRef = createRef<HTMLInputElement>();

	protected override render() {
		return html`
			<label
				for="label-target"
				class="${classMap({
					'discord-string-select-menu-label': true,
					'discord-string-select-menu': true,
					'discord-string-select-menu-disabled': this.disabled
				})}"
				@click=${(event: MouseEvent) => event.stopPropagation()}
			>
				<slot name="default">
					${when(
						this.withSearch,
						() =>
							html`<input
								${ref(this.inputRef)}
								class="search-input"
								id="label-target"
								type="text"
								spellcheck="false"
								autocomplete="off"
								placeholder=${this.placeholder}
								@focus=${() => this.openOptions(true)}
								@input=${(event: KeyboardEvent) => this.handleInput((event.target as HTMLInputElement).value)}
							/>`,
						() => html`<span>${this.placeholder}</span>`
					)}
				</slot>
				<div class="discord-buttons-container">
					${when(
						this.__previousSelectedNode ?? (this.withSearch && this.isSearching),
						() =>
							html`<button
								class="discord-clear-input-button"
								@click=${(event: MouseEvent) => {
									event.stopPropagation();
									if (this.__previousSelectedNode) {
										this.selectOption(void 0);
									} else if (this.inputRef.value) {
										this.inputRef.value.value = '';
										this.handleInput('');
									}
								}}
							>
								${ModalClose()}
							</button>`
					)}
					${ExpandMore({ class: 'discord-expand-more-icon' })}
				</div>
				<span class="discord-string-select-menu-hidden"
					><input id=${this.withSearch ? 'clear-input' : 'label-target'} type="checkbox" @click=${() => this.openOptions()}
				/></span>
			</label>
			<div class="discord-string-select-menu-option-slot discord-string-select-menu-hidden">
				<slot></slot>
				${when(this.noResultsFound, () => html`<center>No results found</center>`)}
			</div>
		`;
	}

	private handleWindowClickOutsideEvent() {
		this.openOptions(false);
		window.removeEventListener('click', this.handleWindowClickOutsideEvent);
	}

	public override disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('click', this.handleWindowClickOutsideEvent);
	}

	@eventOptions({ once: false, capture: true, passive: true })
	private openOptions(open?: boolean) {
		window.removeEventListener('click', this.handleWindowClickOutsideEvent);
		const expandMoreIcon = this.shadowRoot?.querySelectorAll('svg.discord-expand-more-icon').item(0);
		const optionsMenu = this.shadowRoot?.querySelectorAll('div.discord-string-select-menu-option-slot').item(0);
		const stringSelectMenu = this.shadowRoot?.querySelectorAll('label.discord-string-select-menu').item(0);

		if (stringSelectMenu?.className.includes('discord-string-select-menu-disabled')) return;

		const isForceOpen = open === true;
		const isForceClosed = open === false;

		const isClosed = optionsMenu?.className.includes('discord-string-select-menu-hidden');

		if (isClosed || isForceOpen) {
			optionsMenu?.setAttribute('class', 'discord-string-select-menu-option-slot');
			expandMoreIcon?.setAttribute('class', 'discord-expand-more-icon discord-string-select-menu-rotated');
			window.addEventListener('click', this.handleWindowClickOutsideEvent);
			if (DiscordStringSelectMenu.currentOpenInstance && DiscordStringSelectMenu.currentOpenInstance !== this) {
				DiscordStringSelectMenu.currentOpenInstance.openOptions(false);
			}

			DiscordStringSelectMenu.currentOpenInstance = this;
		} else if (!isClosed || isForceClosed) {
			optionsMenu?.setAttribute('class', 'discord-string-select-menu-option-slot discord-string-select-menu-hidden');
			expandMoreIcon?.setAttribute('class', 'discord-expand-more-icon');
			if (DiscordStringSelectMenu.currentOpenInstance === this) {
				DiscordStringSelectMenu.currentOpenInstance = void 0;
			}
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-string-select-menu': DiscordStringSelectMenu;
	}
}
