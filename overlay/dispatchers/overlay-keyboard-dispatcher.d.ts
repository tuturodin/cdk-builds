/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken, Optional } from '@angular/core';
import { OverlayReference } from '../overlay-reference';
import { BaseOverlayDispatcher } from './base-overlay-dispatcher';
/**
 * Service for dispatching keyboard events that land on the body to appropriate overlay ref,
 * if any. It maintains a list of attached overlays to determine best suited overlay based
 * on event target and order of overlay opens.
 */
export declare class OverlayKeyboardDispatcher extends BaseOverlayDispatcher {
    constructor(document: any);
    /** Add a new overlay to the list of attached overlay refs. */
    add(overlayRef: OverlayReference): void;
    /** Detaches the global keyboard event listener. */
    protected detach(): void;
    /** Keyboard event listener that will be attached to the body. */
    private _keydownListener;
}
/** @docs-private @deprecated @breaking-change 8.0.0 */
export declare function OVERLAY_KEYBOARD_DISPATCHER_PROVIDER_FACTORY(dispatcher: OverlayKeyboardDispatcher, _document: any): OverlayKeyboardDispatcher;
/** @docs-private @deprecated @breaking-change 8.0.0 */
export declare const OVERLAY_KEYBOARD_DISPATCHER_PROVIDER: {
    provide: typeof OverlayKeyboardDispatcher;
    deps: (Optional[] | InjectionToken<any>)[];
    useFactory: typeof OVERLAY_KEYBOARD_DISPATCHER_PROVIDER_FACTORY;
};