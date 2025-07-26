import { type ReactWebComponent } from '@lit/react';
import type { LitElement } from 'lit';
import React from 'react';

declare interface Constructor<T> {
	new (): T;
}

export function createReactComponent<T extends LitElement>(tagName: string, _elementClass: Constructor<T>): ReactWebComponent<T> {
	return React.forwardRef(({ children, ...props }: React.PropsWithChildren<any>, ref) => {
		return React.createElement(tagName, { ...props, ref }, children);
	});
}
