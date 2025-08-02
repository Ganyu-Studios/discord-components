import { createContext } from '@lit/context';

export const isInMediaFullScreenPreviewer = createContext<boolean>(Symbol('is-in-media-full-screen-previewer'));

export interface OpenInFullScreenEventDetail {
	slot: number;
}

export interface CloseFullScreenEventDetail {
	closed: true;
}
