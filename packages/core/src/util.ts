import { getConfig, icons } from './config.js';
import type { DiscordTimestamp, Emoji } from './types.js';

export class DiscordComponentsError extends Error {
	public constructor(message: string) {
		super(message);
		this.name = 'DiscordComponentsError';
	}
}

const intlDateFormat = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
const intlTwelveHourFormat = new Intl.DateTimeFormat('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
const intlTwentyFourHourFormat = new Intl.DateTimeFormat('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

const formatDate = (value: Exclude<DiscordTimestamp, null>): string | null => {
	if (!(value instanceof Date)) return value;
	return intlDateFormat.format(value);
};

const formatTime = (value: Exclude<DiscordTimestamp, null>, hour24 = false): string | null => {
	if (!(value instanceof Date)) return value;
	if (hour24) return intlTwentyFourHourFormat.format(value);
	return intlTwelveHourFormat.format(value);
};

export function handleTimestamp(value: DiscordTimestamp, useTime = false, hour24 = false): string | null {
	if (!(value instanceof Date) && typeof value !== 'string') {
		throw new TypeError('Timestamp prop must be a Date object or a string.');
	}

	return useTime ? formatTime(new Date(value), hour24) : formatDate(new Date(value));
}

export const IMAGE_EXTENSION = /\.(?<ext>bmp|jpe?g|png|gif|webp|tiff)$/i;

export function validateImageExtension(url: string) {
	if (!IMAGE_EXTENSION.test(url))
		throw new DiscordComponentsError(`The url of an image for discord-image-attachment should match the regex ${IMAGE_EXTENSION}`);
}

const emojiRegex = /(?:<(?<animated>a)?:(?<name>\w{2,32}):)?(?<id>\d{17,21})>?/;
export function getGlobalEmojiUrl(emojiName: string): Emoji | undefined {
	const globalEmoji = getConfig().emojis?.[emojiName];
	if (globalEmoji) return globalEmoji;

	const match = emojiRegex.exec(emojiName);

	if (match?.groups) {
		const { name, id, animated } = match.groups;
		const extension = animated ? 'gif' : 'png';

		return {
			name,
			url: `https://cdn.discordapp.com/emojis/${id}.${extension}`
		};
	}

	return undefined;
}

/**
 * Get the image for a clan icon
 *
 * @param clanIcon - The clan icon to get the image for
 * @returns The image for the clan icon, or the clan icon itself if it's not found
 */
export function getClanIcon(clanIcon: string | undefined): object | string | undefined {
	if (!clanIcon) return undefined;

	return icons.get(clanIcon) ?? clanIcon;
}

export interface LitMemoResult<T> {
	dependencies: unknown[];
	value: T;
}

export const litMemo = <R>(render: () => R, dependencies: unknown[] = [], old: LitMemoResult<R> | undefined = undefined): LitMemoResult<R> => {
	if (old?.dependencies.every((dep, index) => dep === dependencies[index])) return old;

	return {
		value: render(),
		dependencies
	};
};

const HOUR = 60 * 60 * 1_000;
const DAY = 24 * HOUR;

const capitalize = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

const clampToOnlyDate = (date: Date): Date => {
	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();

	return new Date(year, month, day);
};

const PMRegex = /p\.?\s?m\.?$/;
const AMRegex = /a\.?\s?m\.?$/;

export function dateFormatter(date: Date | string, allowWeekday = false): string {
	const today = new Date();
	const inputDate = new Date(date);

	const isYesterday = clampToOnlyDate(inputDate).getTime() === clampToOnlyDate(today).getTime() - DAY;
	const isToday = clampToOnlyDate(inputDate).getTime() === clampToOnlyDate(today).getTime();

	if (isToday || isYesterday) {
		const hour = inputDate
			.toLocaleTimeString(void 0, { hour: 'numeric', minute: 'numeric', hour12: true })
			.replace(PMRegex, 'PM')
			.replace(AMRegex, 'AM');
		if (isToday) {
			return hour;
		}

		return `Yesterday at ${hour}`;
	}

	const isSameWeek = (d1: Date): boolean => {
		if (!allowWeekday) return false;
		const startOfWeek1 = new Date(d1);
		startOfWeek1.setDate(d1.getDate() - d1.getDay());
		startOfWeek1.setHours(0, 0, 0, 0);

		const endOfWeek1 = new Date(d1);
		endOfWeek1.setDate(d1.getDate() + (6 - d1.getDay()));
		endOfWeek1.setHours(23, 59, 59, 999);

		return inputDate >= startOfWeek1 && inputDate <= endOfWeek1;
	};

	if (isSameWeek(today)) {
		const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
		return capitalize(inputDate.toLocaleDateString(void 0, options));
	} else {
		const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
		return inputDate.toLocaleDateString(void 0, options);
	}
}
