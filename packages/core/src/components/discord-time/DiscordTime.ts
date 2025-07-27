/* eslint-disable id-length */
/**
 * This file is based on
 * https://github.com/ItzDerock/discord-components/tree/main/packages/core/src/components/discord-time/
 */
import { css, html, LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

const DATE_TYPE_FORMATS = {
	t: { timeStyle: 'short' },
	T: { timeStyle: 'medium' },
	d: { dateStyle: 'short' },
	D: { dateStyle: 'long' },
	f: { dateStyle: 'long', timeStyle: 'short' },
	F: { dateStyle: 'full', timeStyle: 'short' },
	R: { style: 'long', numeric: 'auto' }
} as const;

const RELATIVE_DATE_CONVERSION = {
	second: [1_000],
	minute: [60_000],
	hour: [3_600_000, 0.75],
	day: [86_400_000, 0.883, 21.2 * 3_600_000],
	week: [604_800_000, 0.5],
	month: [2_419_200_000, 0.6],
	year: [29_030_400_000, 0.7]
} as const satisfies Record<string, [value: number, rounder?: number, minTake?: number]>;

const MAX_NEXT_UPDATE_DELAY = 2_147_483_647; // 2 ^ 31 - 1 milliseconds (about 24 days)

const ENTRIES_RELATIVE_DATE_CONVERSION = Object.entries(RELATIVE_DATE_CONVERSION);
const formatter = new Intl.RelativeTimeFormat();

@customElement('discord-time')
export class DiscordTime extends LitElement {
	/**
	 * @internal
	 */
	public static override readonly styles = css`
		:host {
			white-space: nowrap;
			background-color: #ffffff0f;
			border-radius: 3px;
			padding: 0 2px;
		}
	`;

	@property({ type: Number, reflect: true })
	public timestamp: number;

	@property({ type: Number, reflect: true })
	public baseNow?: number;

	@property({ type: String, reflect: true })
	public format: keyof typeof DATE_TYPE_FORMATS = 't';

	private timeout?: number;

	@state()
	private resultTime?: string;

	/**
	 * Generates a string for the time.
	 */
	private parseTime() {
		window.clearTimeout(this.timeout);
		if (!this.timestamp) return;
		window.requestAnimationFrame(() => {
			if (this.format === 'R') {
				const [time, nextUpdateIn] = this.getRelativeTime(this.timestamp);
				this.resultTime = time;
				if (this.baseNow) return;
				this.timeout = window.setTimeout(() => {
					this.parseTime();
				}, nextUpdateIn);
				return;
			}

			const date = new Date(this.timestamp * 1_000);
			this.resultTime = date.toLocaleString(undefined, DATE_TYPE_FORMATS[this.format]);
		});
	}

	private getRelativeTime(timestamp: number): [string, number] {
		const time = timestamp * 1_000;
		const date = new Date(time);
		const now = this.baseNow ?? Date.now();
		// ? this is negative when the time is in the future, in the past it's positive
		const diff = now - date.getTime();
		const absDiff = Math.abs(diff);

		if (diff >= 0 && diff < 1_000) {
			return [formatter.format(-1, 'second'), 1_000 - diff];
		}

		let unitTarget: keyof typeof RELATIVE_DATE_CONVERSION = 'second';
		let unitValueTarget = 1_000;
		let roundProportion: number | undefined;

		for (const [unit, [value, rProportion, minTake]] of ENTRIES_RELATIVE_DATE_CONVERSION) {
			if (absDiff > value || (minTake && absDiff > minTake)) {
				unitTarget = unit as keyof typeof RELATIVE_DATE_CONVERSION;
				unitValueTarget = value;
				roundProportion = rProportion;
				continue;
			}

			break;
		}

		const rawUnitValue = diff / unitValueTarget;
		const absUnitValue = Math.abs(rawUnitValue);
		const absFloored = Math.floor(absUnitValue);

		const unitValueDecimals = absUnitValue - absFloored;

		const rounded =
			absUnitValue < 1
				? rawUnitValue < 0
					? -1
					: 1
				: (diff < 0 ? Math.ceil(rawUnitValue) : Math.floor(rawUnitValue)) +
					(roundProportion ? (unitValueDecimals >= roundProportion ? (diff < 0 ? -1 : 1) : 0) : 0);

		const proportion = absUnitValue < 1 ? 1 : diff < 0 ? unitValueDecimals : 1 - unitValueDecimals;
		const nextUpdateIn = Math.min(proportion * unitValueTarget, MAX_NEXT_UPDATE_DELAY);
		const formatted = formatter.format(-rounded, unitTarget);

		return [formatted, nextUpdateIn];
	}

	public override connectedCallback() {
		super.connectedCallback();
		this.parseTime();
	}

	public override disconnectedCallback() {
		super.disconnectedCallback();
		window.clearTimeout(this.timeout);
	}

	public override updated(changedProperties: PropertyValues<this>): void {
		if (!(changedProperties.has('timestamp') || changedProperties.has('format'))) return;
		this.parseTime();
	}

	protected override render() {
		if (!this.timestamp) return html`<slot></slot>`;
		return html`${this.resultTime}`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-time': DiscordTime;
	}
}
