import { __decorate, __metadata, __param } from "tslib";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Injectable, Input, NgZone, isDevMode, } from '@angular/core';
import { take } from 'rxjs/operators';
import { InteractivityChecker } from '../interactivity-checker/interactivity-checker';
import * as i0 from "@angular/core";
import * as i1 from "../interactivity-checker/interactivity-checker";
import * as i2 from "@angular/common";
/**
 * Class that allows for trapping focus within a DOM element.
 *
 * This class currently uses a relatively simple approach to focus trapping.
 * It assumes that the tab order is the same as DOM order, which is not necessarily true.
 * Things like `tabIndex > 0`, flex `order`, and shadow roots can cause to two to misalign.
 *
 * @deprecated Use `ConfigurableFocusTrap` instead.
 * @breaking-change for 11.0.0 Remove this class.
 */
export class FocusTrap {
    constructor(_element, _checker, _ngZone, _document, deferAnchors = false) {
        this._element = _element;
        this._checker = _checker;
        this._ngZone = _ngZone;
        this._document = _document;
        this._hasAttached = false;
        // Event listeners for the anchors. Need to be regular functions so that we can unbind them later.
        this.startAnchorListener = () => this.focusLastTabbableElement();
        this.endAnchorListener = () => this.focusFirstTabbableElement();
        this._enabled = true;
        if (!deferAnchors) {
            this.attachAnchors();
        }
    }
    /** Whether the focus trap is active. */
    get enabled() { return this._enabled; }
    set enabled(value) {
        this._enabled = value;
        if (this._startAnchor && this._endAnchor) {
            this._toggleAnchorTabIndex(value, this._startAnchor);
            this._toggleAnchorTabIndex(value, this._endAnchor);
        }
    }
    /** Destroys the focus trap by cleaning up the anchors. */
    destroy() {
        const startAnchor = this._startAnchor;
        const endAnchor = this._endAnchor;
        if (startAnchor) {
            startAnchor.removeEventListener('focus', this.startAnchorListener);
            if (startAnchor.parentNode) {
                startAnchor.parentNode.removeChild(startAnchor);
            }
        }
        if (endAnchor) {
            endAnchor.removeEventListener('focus', this.endAnchorListener);
            if (endAnchor.parentNode) {
                endAnchor.parentNode.removeChild(endAnchor);
            }
        }
        this._startAnchor = this._endAnchor = null;
    }
    /**
     * Inserts the anchors into the DOM. This is usually done automatically
     * in the constructor, but can be deferred for cases like directives with `*ngIf`.
     * @returns Whether the focus trap managed to attach successfuly. This may not be the case
     * if the target element isn't currently in the DOM.
     */
    attachAnchors() {
        // If we're not on the browser, there can be no focus to trap.
        if (this._hasAttached) {
            return true;
        }
        this._ngZone.runOutsideAngular(() => {
            if (!this._startAnchor) {
                this._startAnchor = this._createAnchor();
                this._startAnchor.addEventListener('focus', this.startAnchorListener);
            }
            if (!this._endAnchor) {
                this._endAnchor = this._createAnchor();
                this._endAnchor.addEventListener('focus', this.endAnchorListener);
            }
        });
        if (this._element.parentNode) {
            this._element.parentNode.insertBefore(this._startAnchor, this._element);
            this._element.parentNode.insertBefore(this._endAnchor, this._element.nextSibling);
            this._hasAttached = true;
        }
        return this._hasAttached;
    }
    /**
     * Waits for the zone to stabilize, then either focuses the first element that the
     * user specified, or the first tabbable element.
     * @returns Returns a promise that resolves with a boolean, depending
     * on whether focus was moved successfuly.
     */
    focusInitialElementWhenReady() {
        return new Promise(resolve => {
            this._executeOnStable(() => resolve(this.focusInitialElement()));
        });
    }
    /**
     * Waits for the zone to stabilize, then focuses
     * the first tabbable element within the focus trap region.
     * @returns Returns a promise that resolves with a boolean, depending
     * on whether focus was moved successfuly.
     */
    focusFirstTabbableElementWhenReady() {
        return new Promise(resolve => {
            this._executeOnStable(() => resolve(this.focusFirstTabbableElement()));
        });
    }
    /**
     * Waits for the zone to stabilize, then focuses
     * the last tabbable element within the focus trap region.
     * @returns Returns a promise that resolves with a boolean, depending
     * on whether focus was moved successfuly.
     */
    focusLastTabbableElementWhenReady() {
        return new Promise(resolve => {
            this._executeOnStable(() => resolve(this.focusLastTabbableElement()));
        });
    }
    /**
     * Get the specified boundary element of the trapped region.
     * @param bound The boundary to get (start or end of trapped region).
     * @returns The boundary element.
     */
    _getRegionBoundary(bound) {
        // Contains the deprecated version of selector, for temporary backwards comparability.
        let markers = this._element.querySelectorAll(`[cdk-focus-region-${bound}], ` +
            `[cdkFocusRegion${bound}], ` +
            `[cdk-focus-${bound}]`);
        for (let i = 0; i < markers.length; i++) {
            // @breaking-change 8.0.0
            if (markers[i].hasAttribute(`cdk-focus-${bound}`)) {
                console.warn(`Found use of deprecated attribute 'cdk-focus-${bound}', ` +
                    `use 'cdkFocusRegion${bound}' instead. The deprecated ` +
                    `attribute will be removed in 8.0.0.`, markers[i]);
            }
            else if (markers[i].hasAttribute(`cdk-focus-region-${bound}`)) {
                console.warn(`Found use of deprecated attribute 'cdk-focus-region-${bound}', ` +
                    `use 'cdkFocusRegion${bound}' instead. The deprecated attribute ` +
                    `will be removed in 8.0.0.`, markers[i]);
            }
        }
        if (bound == 'start') {
            return markers.length ? markers[0] : this._getFirstTabbableElement(this._element);
        }
        return markers.length ?
            markers[markers.length - 1] : this._getLastTabbableElement(this._element);
    }
    /**
     * Focuses the element that should be focused when the focus trap is initialized.
     * @returns Whether focus was moved successfuly.
     */
    focusInitialElement() {
        // Contains the deprecated version of selector, for temporary backwards comparability.
        const redirectToElement = this._element.querySelector(`[cdk-focus-initial], ` +
            `[cdkFocusInitial]`);
        if (redirectToElement) {
            // @breaking-change 8.0.0
            if (redirectToElement.hasAttribute(`cdk-focus-initial`)) {
                console.warn(`Found use of deprecated attribute 'cdk-focus-initial', ` +
                    `use 'cdkFocusInitial' instead. The deprecated attribute ` +
                    `will be removed in 8.0.0`, redirectToElement);
            }
            // Warn the consumer if the element they've pointed to
            // isn't focusable, when not in production mode.
            if (isDevMode() && !this._checker.isFocusable(redirectToElement)) {
                console.warn(`Element matching '[cdkFocusInitial]' is not focusable.`, redirectToElement);
            }
            redirectToElement.focus();
            return true;
        }
        return this.focusFirstTabbableElement();
    }
    /**
     * Focuses the first tabbable element within the focus trap region.
     * @returns Whether focus was moved successfuly.
     */
    focusFirstTabbableElement() {
        const redirectToElement = this._getRegionBoundary('start');
        if (redirectToElement) {
            redirectToElement.focus();
        }
        return !!redirectToElement;
    }
    /**
     * Focuses the last tabbable element within the focus trap region.
     * @returns Whether focus was moved successfuly.
     */
    focusLastTabbableElement() {
        const redirectToElement = this._getRegionBoundary('end');
        if (redirectToElement) {
            redirectToElement.focus();
        }
        return !!redirectToElement;
    }
    /**
     * Checks whether the focus trap has successfuly been attached.
     */
    hasAttached() {
        return this._hasAttached;
    }
    /** Get the first tabbable element from a DOM subtree (inclusive). */
    _getFirstTabbableElement(root) {
        if (this._checker.isFocusable(root) && this._checker.isTabbable(root)) {
            return root;
        }
        // Iterate in DOM order. Note that IE doesn't have `children` for SVG so we fall
        // back to `childNodes` which includes text nodes, comments etc.
        let children = root.children || root.childNodes;
        for (let i = 0; i < children.length; i++) {
            let tabbableChild = children[i].nodeType === this._document.ELEMENT_NODE ?
                this._getFirstTabbableElement(children[i]) :
                null;
            if (tabbableChild) {
                return tabbableChild;
            }
        }
        return null;
    }
    /** Get the last tabbable element from a DOM subtree (inclusive). */
    _getLastTabbableElement(root) {
        if (this._checker.isFocusable(root) && this._checker.isTabbable(root)) {
            return root;
        }
        // Iterate in reverse DOM order.
        let children = root.children || root.childNodes;
        for (let i = children.length - 1; i >= 0; i--) {
            let tabbableChild = children[i].nodeType === this._document.ELEMENT_NODE ?
                this._getLastTabbableElement(children[i]) :
                null;
            if (tabbableChild) {
                return tabbableChild;
            }
        }
        return null;
    }
    /** Creates an anchor element. */
    _createAnchor() {
        const anchor = this._document.createElement('div');
        this._toggleAnchorTabIndex(this._enabled, anchor);
        anchor.classList.add('cdk-visually-hidden');
        anchor.classList.add('cdk-focus-trap-anchor');
        anchor.setAttribute('aria-hidden', 'true');
        return anchor;
    }
    /**
     * Toggles the `tabindex` of an anchor, based on the enabled state of the focus trap.
     * @param isEnabled Whether the focus trap is enabled.
     * @param anchor Anchor on which to toggle the tabindex.
     */
    _toggleAnchorTabIndex(isEnabled, anchor) {
        // Remove the tabindex completely, rather than setting it to -1, because if the
        // element has a tabindex, the user might still hit it when navigating with the arrow keys.
        isEnabled ? anchor.setAttribute('tabindex', '0') : anchor.removeAttribute('tabindex');
    }
    /**
     * Toggles the`tabindex` of both anchors to either trap Tab focus or allow it to escape.
     * @param enabled: Whether the anchors should trap Tab.
     */
    toggleAnchors(enabled) {
        if (this._startAnchor && this._endAnchor) {
            this._toggleAnchorTabIndex(enabled, this._startAnchor);
            this._toggleAnchorTabIndex(enabled, this._endAnchor);
        }
    }
    /** Executes a function when the zone is stable. */
    _executeOnStable(fn) {
        if (this._ngZone.isStable) {
            fn();
        }
        else {
            this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(fn);
        }
    }
}
/**
 * Factory that allows easy instantiation of focus traps.
 * @deprecated Use `ConfigurableFocusTrapFactory` instead.
 * @breaking-change for 11.0.0 Remove this class.
 */
let FocusTrapFactory = /** @class */ (() => {
    let FocusTrapFactory = class FocusTrapFactory {
        constructor(_checker, _ngZone, _document) {
            this._checker = _checker;
            this._ngZone = _ngZone;
            this._document = _document;
        }
        /**
         * Creates a focus-trapped region around the given element.
         * @param element The element around which focus will be trapped.
         * @param deferCaptureElements Defers the creation of focus-capturing elements to be done
         *     manually by the user.
         * @returns The created focus trap instance.
         */
        create(element, deferCaptureElements = false) {
            return new FocusTrap(element, this._checker, this._ngZone, this._document, deferCaptureElements);
        }
    };
    FocusTrapFactory.ɵprov = i0.ɵɵdefineInjectable({ factory: function FocusTrapFactory_Factory() { return new FocusTrapFactory(i0.ɵɵinject(i1.InteractivityChecker), i0.ɵɵinject(i0.NgZone), i0.ɵɵinject(i2.DOCUMENT)); }, token: FocusTrapFactory, providedIn: "root" });
    FocusTrapFactory = __decorate([
        Injectable({ providedIn: 'root' }),
        __param(2, Inject(DOCUMENT)),
        __metadata("design:paramtypes", [InteractivityChecker,
            NgZone, Object])
    ], FocusTrapFactory);
    return FocusTrapFactory;
})();
export { FocusTrapFactory };
/** Directive for trapping focus within a region. */
let CdkTrapFocus = /** @class */ (() => {
    let CdkTrapFocus = class CdkTrapFocus {
        constructor(_elementRef, _focusTrapFactory, _document) {
            this._elementRef = _elementRef;
            this._focusTrapFactory = _focusTrapFactory;
            /** Previously focused element to restore focus to upon destroy when using autoCapture. */
            this._previouslyFocusedElement = null;
            this._document = _document;
            this.focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement, true);
        }
        /** Whether the focus trap is active. */
        get enabled() { return this.focusTrap.enabled; }
        set enabled(value) { this.focusTrap.enabled = coerceBooleanProperty(value); }
        /**
         * Whether the directive should automatially move focus into the trapped region upon
         * initialization and return focus to the previous activeElement upon destruction.
         */
        get autoCapture() { return this._autoCapture; }
        set autoCapture(value) { this._autoCapture = coerceBooleanProperty(value); }
        ngOnDestroy() {
            this.focusTrap.destroy();
            // If we stored a previously focused element when using autoCapture, return focus to that
            // element now that the trapped region is being destroyed.
            if (this._previouslyFocusedElement) {
                this._previouslyFocusedElement.focus();
                this._previouslyFocusedElement = null;
            }
        }
        ngAfterContentInit() {
            this.focusTrap.attachAnchors();
            if (this.autoCapture) {
                this._previouslyFocusedElement = this._document.activeElement;
                this.focusTrap.focusInitialElementWhenReady();
            }
        }
        ngDoCheck() {
            if (!this.focusTrap.hasAttached()) {
                this.focusTrap.attachAnchors();
            }
        }
    };
    __decorate([
        Input('cdkTrapFocus'),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], CdkTrapFocus.prototype, "enabled", null);
    __decorate([
        Input('cdkTrapFocusAutoCapture'),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], CdkTrapFocus.prototype, "autoCapture", null);
    CdkTrapFocus = __decorate([
        Directive({
            selector: '[cdkTrapFocus]',
            exportAs: 'cdkTrapFocus',
        }),
        __param(2, Inject(DOCUMENT)),
        __metadata("design:paramtypes", [ElementRef,
            FocusTrapFactory, Object])
    ], CdkTrapFocus);
    return CdkTrapFocus;
})();
export { CdkTrapFocus };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9jdXMtdHJhcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvYTExeS9mb2N1cy10cmFwL2ZvY3VzLXRyYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBRUwsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sVUFBVSxFQUNWLEtBQUssRUFDTCxNQUFNLEVBR04sU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwQyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxnREFBZ0QsQ0FBQzs7OztBQUdwRjs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFNLE9BQU8sU0FBUztJQXFCcEIsWUFDVyxRQUFxQixFQUN0QixRQUE4QixFQUM3QixPQUFlLEVBQ2YsU0FBbUIsRUFDNUIsWUFBWSxHQUFHLEtBQUs7UUFKWCxhQUFRLEdBQVIsUUFBUSxDQUFhO1FBQ3RCLGFBQVEsR0FBUixRQUFRLENBQXNCO1FBQzdCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBdEJ0QixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUU3QixrR0FBa0c7UUFDeEYsd0JBQW1CLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7UUFDNUQsc0JBQWlCLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7UUFZM0QsYUFBUSxHQUFZLElBQUksQ0FBQztRQVNqQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FB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VyxFQUFFLEVBQUU7Z0JBQ2pDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUM7YUFDaEM7UUFDSCxDQUFDO0tBSUYsQ0FBQTtJQWpEQztRQURDLEtBQUssQ0FBQyxjQUFjLENBQUM7OzsrQ0FDbUM7SUFRekQ7UUFEQyxLQUFLLENBQUMseUJBQXlCLENBQUM7OzttREFDdUI7SUFuQjdDLFlBQVk7UUFKeEIsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQixRQUFRLEVBQUUsY0FBYztTQUN6QixDQUFDO1FBMkJLLFdBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO3lDQUZJLFVBQVU7WUFDSixnQkFBZ0I7T0F6QnBDLFlBQVksQ0E0RHhCO0lBQUQsbUJBQUM7S0FBQTtTQTVEWSxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIEluamVjdGFibGUsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgRG9DaGVjayxcbiAgaXNEZXZNb2RlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtJbnRlcmFjdGl2aXR5Q2hlY2tlcn0gZnJvbSAnLi4vaW50ZXJhY3Rpdml0eS1jaGVja2VyL2ludGVyYWN0aXZpdHktY2hlY2tlcic7XG5cblxuLyoqXG4gKiBDbGFzcyB0aGF0IGFsbG93cyBmb3IgdHJhcHBpbmcgZm9jdXMgd2l0aGluIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogVGhpcyBjbGFzcyBjdXJyZW50bHkgdXNlcyBhIHJlbGF0aXZlbHkgc2ltcGxlIGFwcHJvYWNoIHRvIGZvY3VzIHRyYXBwaW5nLlxuICogSXQgYXNzdW1lcyB0aGF0IHRoZSB0YWIgb3JkZXIgaXMgdGhlIHNhbWUgYXMgRE9NIG9yZGVyLCB3aGljaCBpcyBub3QgbmVjZXNzYXJpbHkgdHJ1ZS5cbiAqIFRoaW5ncyBsaWtlIGB0YWJJbmRleCA+IDBgLCBmbGV4IGBvcmRlcmAsIGFuZCBzaGFkb3cgcm9vdHMgY2FuIGNhdXNlIHRvIHR3byB0byBtaXNhbGlnbi5cbiAqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYENvbmZpZ3VyYWJsZUZvY3VzVHJhcGAgaW5zdGVhZC5cbiAqIEBicmVha2luZy1jaGFuZ2UgZm9yIDExLjAuMCBSZW1vdmUgdGhpcyBjbGFzcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEZvY3VzVHJhcCB7XG4gIHByaXZhdGUgX3N0YXJ0QW5jaG9yOiBIVE1MRWxlbWVudCB8IG51bGw7XG4gIHByaXZhdGUgX2VuZEFuY2hvcjogSFRNTEVsZW1lbnQgfCBudWxsO1xuICBwcml2YXRlIF9oYXNBdHRhY2hlZCA9IGZhbHNlO1xuXG4gIC8vIEV2ZW50IGxpc3RlbmVycyBmb3IgdGhlIGFuY2hvcnMuIE5lZWQgdG8gYmUgcmVndWxhciBmdW5jdGlvbnMgc28gdGhhdCB3ZSBjYW4gdW5iaW5kIHRoZW0gbGF0ZXIuXG4gIHByb3RlY3RlZCBzdGFydEFuY2hvckxpc3RlbmVyID0gKCkgPT4gdGhpcy5mb2N1c0xhc3RUYWJiYWJsZUVsZW1lbnQoKTtcbiAgcHJvdGVjdGVkIGVuZEFuY2hvckxpc3RlbmVyID0gKCkgPT4gdGhpcy5mb2N1c0ZpcnN0VGFiYmFibGVFbGVtZW50KCk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGZvY3VzIHRyYXAgaXMgYWN0aXZlLiAqL1xuICBnZXQgZW5hYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2VuYWJsZWQ7IH1cbiAgc2V0IGVuYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9lbmFibGVkID0gdmFsdWU7XG5cbiAgICBpZiAodGhpcy5fc3RhcnRBbmNob3IgJiYgdGhpcy5fZW5kQW5jaG9yKSB7XG4gICAgICB0aGlzLl90b2dnbGVBbmNob3JUYWJJbmRleCh2YWx1ZSwgdGhpcy5fc3RhcnRBbmNob3IpO1xuICAgICAgdGhpcy5fdG9nZ2xlQW5jaG9yVGFiSW5kZXgodmFsdWUsIHRoaXMuX2VuZEFuY2hvcik7XG4gICAgfVxuICB9XG4gIHByb3RlY3RlZCBfZW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgX2VsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgIHByaXZhdGUgX2NoZWNrZXI6IEludGVyYWN0aXZpdHlDaGVja2VyLFxuICAgIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSxcbiAgICByZWFkb25seSBfZG9jdW1lbnQ6IERvY3VtZW50LFxuICAgIGRlZmVyQW5jaG9ycyA9IGZhbHNlKSB7XG5cbiAgICBpZiAoIWRlZmVyQW5jaG9ycykge1xuICAgICAgdGhpcy5hdHRhY2hBbmNob3JzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERlc3Ryb3lzIHRoZSBmb2N1cyB0cmFwIGJ5IGNsZWFuaW5nIHVwIHRoZSBhbmNob3JzLiAqL1xuICBkZXN0cm95KCkge1xuICAgIGNvbnN0IHN0YXJ0QW5jaG9yID0gdGhpcy5fc3RhcnRBbmNob3I7XG4gICAgY29uc3QgZW5kQW5jaG9yID0gdGhpcy5fZW5kQW5jaG9yO1xuXG4gICAgaWYgKHN0YXJ0QW5jaG9yKSB7XG4gICAgICBzdGFydEFuY2hvci5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuc3RhcnRBbmNob3JMaXN0ZW5lcik7XG5cbiAgICAgIGlmIChzdGFydEFuY2hvci5wYXJlbnROb2RlKSB7XG4gICAgICAgIHN0YXJ0QW5jaG9yLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3RhcnRBbmNob3IpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlbmRBbmNob3IpIHtcbiAgICAgIGVuZEFuY2hvci5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuZW5kQW5jaG9yTGlzdGVuZXIpO1xuXG4gICAgICBpZiAoZW5kQW5jaG9yLnBhcmVudE5vZGUpIHtcbiAgICAgICAgZW5kQW5jaG9yLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZW5kQW5jaG9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9zdGFydEFuY2hvciA9IHRoaXMuX2VuZEFuY2hvciA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0cyB0aGUgYW5jaG9ycyBpbnRvIHRoZSBET00uIFRoaXMgaXMgdXN1YWxseSBkb25lIGF1dG9tYXRpY2FsbHlcbiAgICogaW4gdGhlIGNvbnN0cnVjdG9yLCBidXQgY2FuIGJlIGRlZmVycmVkIGZvciBjYXNlcyBsaWtlIGRpcmVjdGl2ZXMgd2l0aCBgKm5nSWZgLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBmb2N1cyB0cmFwIG1hbmFnZWQgdG8gYXR0YWNoIHN1Y2Nlc3NmdWx5LiBUaGlzIG1heSBub3QgYmUgdGhlIGNhc2VcbiAgICogaWYgdGhlIHRhcmdldCBlbGVtZW50IGlzbid0IGN1cnJlbnRseSBpbiB0aGUgRE9NLlxuICAgKi9cbiAgYXR0YWNoQW5jaG9ycygpOiBib29sZWFuIHtcbiAgICAvLyBJZiB3ZSdyZSBub3Qgb24gdGhlIGJyb3dzZXIsIHRoZXJlIGNhbiBiZSBubyBmb2N1cyB0byB0cmFwLlxuICAgIGlmICh0aGlzLl9oYXNBdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5fc3RhcnRBbmNob3IpIHtcbiAgICAgICAgdGhpcy5fc3RhcnRBbmNob3IgPSB0aGlzLl9jcmVhdGVBbmNob3IoKTtcbiAgICAgICAgdGhpcy5fc3RhcnRBbmNob3IhLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5zdGFydEFuY2hvckxpc3RlbmVyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLl9lbmRBbmNob3IpIHtcbiAgICAgICAgdGhpcy5fZW5kQW5jaG9yID0gdGhpcy5fY3JlYXRlQW5jaG9yKCk7XG4gICAgICAgIHRoaXMuX2VuZEFuY2hvciEuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLmVuZEFuY2hvckxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5fc3RhcnRBbmNob3IhLCB0aGlzLl9lbGVtZW50KTtcbiAgICAgIHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5fZW5kQW5jaG9yISwgdGhpcy5fZWxlbWVudC5uZXh0U2libGluZyk7XG4gICAgICB0aGlzLl9oYXNBdHRhY2hlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2hhc0F0dGFjaGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhaXRzIGZvciB0aGUgem9uZSB0byBzdGFiaWxpemUsIHRoZW4gZWl0aGVyIGZvY3VzZXMgdGhlIGZpcnN0IGVsZW1lbnQgdGhhdCB0aGVcbiAgICogdXNlciBzcGVjaWZpZWQsIG9yIHRoZSBmaXJzdCB0YWJiYWJsZSBlbGVtZW50LlxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggYSBib29sZWFuLCBkZXBlbmRpbmdcbiAgICogb24gd2hldGhlciBmb2N1cyB3YXMgbW92ZWQgc3VjY2Vzc2Z1bHkuXG4gICAqL1xuICBmb2N1c0luaXRpYWxFbGVtZW50V2hlblJlYWR5KCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPihyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuX2V4ZWN1dGVPblN0YWJsZSgoKSA9PiByZXNvbHZlKHRoaXMuZm9jdXNJbml0aWFsRWxlbWVudCgpKSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogV2FpdHMgZm9yIHRoZSB6b25lIHRvIHN0YWJpbGl6ZSwgdGhlbiBmb2N1c2VzXG4gICAqIHRoZSBmaXJzdCB0YWJiYWJsZSBlbGVtZW50IHdpdGhpbiB0aGUgZm9jdXMgdHJhcCByZWdpb24uXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCBhIGJvb2xlYW4sIGRlcGVuZGluZ1xuICAgKiBvbiB3aGV0aGVyIGZvY3VzIHdhcyBtb3ZlZCBzdWNjZXNzZnVseS5cbiAgICovXG4gIGZvY3VzRmlyc3RUYWJiYWJsZUVsZW1lbnRXaGVuUmVhZHkoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5fZXhlY3V0ZU9uU3RhYmxlKCgpID0+IHJlc29sdmUodGhpcy5mb2N1c0ZpcnN0VGFiYmFibGVFbGVtZW50KCkpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXYWl0cyBmb3IgdGhlIHpvbmUgdG8gc3RhYmlsaXplLCB0aGVuIGZvY3VzZXNcbiAgICogdGhlIGxhc3QgdGFiYmFibGUgZWxlbWVudCB3aXRoaW4gdGhlIGZvY3VzIHRyYXAgcmVnaW9uLlxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggYSBib29sZWFuLCBkZXBlbmRpbmdcbiAgICogb24gd2hldGhlciBmb2N1cyB3YXMgbW92ZWQgc3VjY2Vzc2Z1bHkuXG4gICAqL1xuICBmb2N1c0xhc3RUYWJiYWJsZUVsZW1lbnRXaGVuUmVhZHkoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5fZXhlY3V0ZU9uU3RhYmxlKCgpID0+IHJlc29sdmUodGhpcy5mb2N1c0xhc3RUYWJiYWJsZUVsZW1lbnQoKSkpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgc3BlY2lmaWVkIGJvdW5kYXJ5IGVsZW1lbnQgb2YgdGhlIHRyYXBwZWQgcmVnaW9uLlxuICAgKiBAcGFyYW0gYm91bmQgVGhlIGJvdW5kYXJ5IHRvIGdldCAoc3RhcnQgb3IgZW5kIG9mIHRyYXBwZWQgcmVnaW9uKS5cbiAgICogQHJldHVybnMgVGhlIGJvdW5kYXJ5IGVsZW1lbnQuXG4gICAqL1xuICBwcml2YXRlIF9nZXRSZWdpb25Cb3VuZGFyeShib3VuZDogJ3N0YXJ0JyB8ICdlbmQnKTogSFRNTEVsZW1lbnQgfCBudWxsIHtcbiAgICAvLyBDb250YWlucyB0aGUgZGVwcmVjYXRlZCB2ZXJzaW9uIG9mIHNlbGVjdG9yLCBmb3IgdGVtcG9yYXJ5IGJhY2t3YXJkcyBjb21wYXJhYmlsaXR5LlxuICAgIGxldCBtYXJrZXJzID0gdGhpcy5fZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbY2RrLWZvY3VzLXJlZ2lvbi0ke2JvdW5kfV0sIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBbY2RrRm9jdXNSZWdpb24ke2JvdW5kfV0sIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBbY2RrLWZvY3VzLSR7Ym91bmR9XWApIGFzIE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAgICBpZiAobWFya2Vyc1tpXS5oYXNBdHRyaWJ1dGUoYGNkay1mb2N1cy0ke2JvdW5kfWApKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgRm91bmQgdXNlIG9mIGRlcHJlY2F0ZWQgYXR0cmlidXRlICdjZGstZm9jdXMtJHtib3VuZH0nLCBgICtcbiAgICAgICAgICAgICAgICAgICAgIGB1c2UgJ2Nka0ZvY3VzUmVnaW9uJHtib3VuZH0nIGluc3RlYWQuIFRoZSBkZXByZWNhdGVkIGAgK1xuICAgICAgICAgICAgICAgICAgICAgYGF0dHJpYnV0ZSB3aWxsIGJlIHJlbW92ZWQgaW4gOC4wLjAuYCwgbWFya2Vyc1tpXSk7XG4gICAgICB9IGVsc2UgaWYgKG1hcmtlcnNbaV0uaGFzQXR0cmlidXRlKGBjZGstZm9jdXMtcmVnaW9uLSR7Ym91bmR9YCkpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBGb3VuZCB1c2Ugb2YgZGVwcmVjYXRlZCBhdHRyaWJ1dGUgJ2Nkay1mb2N1cy1yZWdpb24tJHtib3VuZH0nLCBgICtcbiAgICAgICAgICAgICAgICAgICAgIGB1c2UgJ2Nka0ZvY3VzUmVnaW9uJHtib3VuZH0nIGluc3RlYWQuIFRoZSBkZXByZWNhdGVkIGF0dHJpYnV0ZSBgICtcbiAgICAgICAgICAgICAgICAgICAgIGB3aWxsIGJlIHJlbW92ZWQgaW4gOC4wLjAuYCwgbWFya2Vyc1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGJvdW5kID09ICdzdGFydCcpIHtcbiAgICAgIHJldHVybiBtYXJrZXJzLmxlbmd0aCA/IG1hcmtlcnNbMF0gOiB0aGlzLl9nZXRGaXJzdFRhYmJhYmxlRWxlbWVudCh0aGlzLl9lbGVtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIG1hcmtlcnMubGVuZ3RoID9cbiAgICAgICAgbWFya2Vyc1ttYXJrZXJzLmxlbmd0aCAtIDFdIDogdGhpcy5fZ2V0TGFzdFRhYmJhYmxlRWxlbWVudCh0aGlzLl9lbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBlbGVtZW50IHRoYXQgc2hvdWxkIGJlIGZvY3VzZWQgd2hlbiB0aGUgZm9jdXMgdHJhcCBpcyBpbml0aWFsaXplZC5cbiAgICogQHJldHVybnMgV2hldGhlciBmb2N1cyB3YXMgbW92ZWQgc3VjY2Vzc2Z1bHkuXG4gICAqL1xuICBmb2N1c0luaXRpYWxFbGVtZW50KCk6IGJvb2xlYW4ge1xuICAgIC8vIENvbnRhaW5zIHRoZSBkZXByZWNhdGVkIHZlcnNpb24gb2Ygc2VsZWN0b3IsIGZvciB0ZW1wb3JhcnkgYmFja3dhcmRzIGNvbXBhcmFiaWxpdHkuXG4gICAgY29uc3QgcmVkaXJlY3RUb0VsZW1lbnQgPSB0aGlzLl9lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYFtjZGstZm9jdXMtaW5pdGlhbF0sIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBbY2RrRm9jdXNJbml0aWFsXWApIGFzIEhUTUxFbGVtZW50O1xuXG4gICAgaWYgKHJlZGlyZWN0VG9FbGVtZW50KSB7XG4gICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAgICBpZiAocmVkaXJlY3RUb0VsZW1lbnQuaGFzQXR0cmlidXRlKGBjZGstZm9jdXMtaW5pdGlhbGApKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgRm91bmQgdXNlIG9mIGRlcHJlY2F0ZWQgYXR0cmlidXRlICdjZGstZm9jdXMtaW5pdGlhbCcsIGAgK1xuICAgICAgICAgICAgICAgICAgICBgdXNlICdjZGtGb2N1c0luaXRpYWwnIGluc3RlYWQuIFRoZSBkZXByZWNhdGVkIGF0dHJpYnV0ZSBgICtcbiAgICAgICAgICAgICAgICAgICAgYHdpbGwgYmUgcmVtb3ZlZCBpbiA4LjAuMGAsIHJlZGlyZWN0VG9FbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgLy8gV2FybiB0aGUgY29uc3VtZXIgaWYgdGhlIGVsZW1lbnQgdGhleSd2ZSBwb2ludGVkIHRvXG4gICAgICAvLyBpc24ndCBmb2N1c2FibGUsIHdoZW4gbm90IGluIHByb2R1Y3Rpb24gbW9kZS5cbiAgICAgIGlmIChpc0Rldk1vZGUoKSAmJiAhdGhpcy5fY2hlY2tlci5pc0ZvY3VzYWJsZShyZWRpcmVjdFRvRWxlbWVudCkpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBFbGVtZW50IG1hdGNoaW5nICdbY2RrRm9jdXNJbml0aWFsXScgaXMgbm90IGZvY3VzYWJsZS5gLCByZWRpcmVjdFRvRWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIHJlZGlyZWN0VG9FbGVtZW50LmZvY3VzKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5mb2N1c0ZpcnN0VGFiYmFibGVFbGVtZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogRm9jdXNlcyB0aGUgZmlyc3QgdGFiYmFibGUgZWxlbWVudCB3aXRoaW4gdGhlIGZvY3VzIHRyYXAgcmVnaW9uLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIGZvY3VzIHdhcyBtb3ZlZCBzdWNjZXNzZnVseS5cbiAgICovXG4gIGZvY3VzRmlyc3RUYWJiYWJsZUVsZW1lbnQoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcmVkaXJlY3RUb0VsZW1lbnQgPSB0aGlzLl9nZXRSZWdpb25Cb3VuZGFyeSgnc3RhcnQnKTtcblxuICAgIGlmIChyZWRpcmVjdFRvRWxlbWVudCkge1xuICAgICAgcmVkaXJlY3RUb0VsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gISFyZWRpcmVjdFRvRWxlbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBsYXN0IHRhYmJhYmxlIGVsZW1lbnQgd2l0aGluIHRoZSBmb2N1cyB0cmFwIHJlZ2lvbi5cbiAgICogQHJldHVybnMgV2hldGhlciBmb2N1cyB3YXMgbW92ZWQgc3VjY2Vzc2Z1bHkuXG4gICAqL1xuICBmb2N1c0xhc3RUYWJiYWJsZUVsZW1lbnQoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcmVkaXJlY3RUb0VsZW1lbnQgPSB0aGlzLl9nZXRSZWdpb25Cb3VuZGFyeSgnZW5kJyk7XG5cbiAgICBpZiAocmVkaXJlY3RUb0VsZW1lbnQpIHtcbiAgICAgIHJlZGlyZWN0VG9FbGVtZW50LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuICEhcmVkaXJlY3RUb0VsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGZvY3VzIHRyYXAgaGFzIHN1Y2Nlc3NmdWx5IGJlZW4gYXR0YWNoZWQuXG4gICAqL1xuICBoYXNBdHRhY2hlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faGFzQXR0YWNoZWQ7XG4gIH1cblxuICAvKiogR2V0IHRoZSBmaXJzdCB0YWJiYWJsZSBlbGVtZW50IGZyb20gYSBET00gc3VidHJlZSAoaW5jbHVzaXZlKS4gKi9cbiAgcHJpdmF0ZSBfZ2V0Rmlyc3RUYWJiYWJsZUVsZW1lbnQocm9vdDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB8IG51bGwge1xuICAgIGlmICh0aGlzLl9jaGVja2VyLmlzRm9jdXNhYmxlKHJvb3QpICYmIHRoaXMuX2NoZWNrZXIuaXNUYWJiYWJsZShyb290KSkge1xuICAgICAgcmV0dXJuIHJvb3Q7XG4gICAgfVxuXG4gICAgLy8gSXRlcmF0ZSBpbiBET00gb3JkZXIuIE5vdGUgdGhhdCBJRSBkb2Vzbid0IGhhdmUgYGNoaWxkcmVuYCBmb3IgU1ZHIHNvIHdlIGZhbGxcbiAgICAvLyBiYWNrIHRvIGBjaGlsZE5vZGVzYCB3aGljaCBpbmNsdWRlcyB0ZXh0IG5vZGVzLCBjb21tZW50cyBldGMuXG4gICAgbGV0IGNoaWxkcmVuID0gcm9vdC5jaGlsZHJlbiB8fCByb290LmNoaWxkTm9kZXM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgdGFiYmFibGVDaGlsZCA9IGNoaWxkcmVuW2ldLm5vZGVUeXBlID09PSB0aGlzLl9kb2N1bWVudC5FTEVNRU5UX05PREUgP1xuICAgICAgICB0aGlzLl9nZXRGaXJzdFRhYmJhYmxlRWxlbWVudChjaGlsZHJlbltpXSBhcyBIVE1MRWxlbWVudCkgOlxuICAgICAgICBudWxsO1xuXG4gICAgICBpZiAodGFiYmFibGVDaGlsZCkge1xuICAgICAgICByZXR1cm4gdGFiYmFibGVDaGlsZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXQgdGhlIGxhc3QgdGFiYmFibGUgZWxlbWVudCBmcm9tIGEgRE9NIHN1YnRyZWUgKGluY2x1c2l2ZSkuICovXG4gIHByaXZhdGUgX2dldExhc3RUYWJiYWJsZUVsZW1lbnQocm9vdDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB8IG51bGwge1xuICAgIGlmICh0aGlzLl9jaGVja2VyLmlzRm9jdXNhYmxlKHJvb3QpICYmIHRoaXMuX2NoZWNrZXIuaXNUYWJiYWJsZShyb290KSkge1xuICAgICAgcmV0dXJuIHJvb3Q7XG4gICAgfVxuXG4gICAgLy8gSXRlcmF0ZSBpbiByZXZlcnNlIERPTSBvcmRlci5cbiAgICBsZXQgY2hpbGRyZW4gPSByb290LmNoaWxkcmVuIHx8IHJvb3QuY2hpbGROb2RlcztcblxuICAgIGZvciAobGV0IGkgPSBjaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgbGV0IHRhYmJhYmxlQ2hpbGQgPSBjaGlsZHJlbltpXS5ub2RlVHlwZSA9PT0gdGhpcy5fZG9jdW1lbnQuRUxFTUVOVF9OT0RFID9cbiAgICAgICAgdGhpcy5fZ2V0TGFzdFRhYmJhYmxlRWxlbWVudChjaGlsZHJlbltpXSBhcyBIVE1MRWxlbWVudCkgOlxuICAgICAgICBudWxsO1xuXG4gICAgICBpZiAodGFiYmFibGVDaGlsZCkge1xuICAgICAgICByZXR1cm4gdGFiYmFibGVDaGlsZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGFuIGFuY2hvciBlbGVtZW50LiAqL1xuICBwcml2YXRlIF9jcmVhdGVBbmNob3IoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGFuY2hvciA9IHRoaXMuX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuX3RvZ2dsZUFuY2hvclRhYkluZGV4KHRoaXMuX2VuYWJsZWQsIGFuY2hvcik7XG4gICAgYW5jaG9yLmNsYXNzTGlzdC5hZGQoJ2Nkay12aXN1YWxseS1oaWRkZW4nKTtcbiAgICBhbmNob3IuY2xhc3NMaXN0LmFkZCgnY2RrLWZvY3VzLXRyYXAtYW5jaG9yJyk7XG4gICAgYW5jaG9yLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIHJldHVybiBhbmNob3I7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgYHRhYmluZGV4YCBvZiBhbiBhbmNob3IsIGJhc2VkIG9uIHRoZSBlbmFibGVkIHN0YXRlIG9mIHRoZSBmb2N1cyB0cmFwLlxuICAgKiBAcGFyYW0gaXNFbmFibGVkIFdoZXRoZXIgdGhlIGZvY3VzIHRyYXAgaXMgZW5hYmxlZC5cbiAgICogQHBhcmFtIGFuY2hvciBBbmNob3Igb24gd2hpY2ggdG8gdG9nZ2xlIHRoZSB0YWJpbmRleC5cbiAgICovXG4gIHByaXZhdGUgX3RvZ2dsZUFuY2hvclRhYkluZGV4KGlzRW5hYmxlZDogYm9vbGVhbiwgYW5jaG9yOiBIVE1MRWxlbWVudCkge1xuICAgIC8vIFJlbW92ZSB0aGUgdGFiaW5kZXggY29tcGxldGVseSwgcmF0aGVyIHRoYW4gc2V0dGluZyBpdCB0byAtMSwgYmVjYXVzZSBpZiB0aGVcbiAgICAvLyBlbGVtZW50IGhhcyBhIHRhYmluZGV4LCB0aGUgdXNlciBtaWdodCBzdGlsbCBoaXQgaXQgd2hlbiBuYXZpZ2F0aW5nIHdpdGggdGhlIGFycm93IGtleXMuXG4gICAgaXNFbmFibGVkID8gYW5jaG9yLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpIDogYW5jaG9yLnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZWB0YWJpbmRleGAgb2YgYm90aCBhbmNob3JzIHRvIGVpdGhlciB0cmFwIFRhYiBmb2N1cyBvciBhbGxvdyBpdCB0byBlc2NhcGUuXG4gICAqIEBwYXJhbSBlbmFibGVkOiBXaGV0aGVyIHRoZSBhbmNob3JzIHNob3VsZCB0cmFwIFRhYi5cbiAgICovXG4gIHByb3RlY3RlZCB0b2dnbGVBbmNob3JzKGVuYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5fc3RhcnRBbmNob3IgJiYgdGhpcy5fZW5kQW5jaG9yKSB7XG4gICAgICB0aGlzLl90b2dnbGVBbmNob3JUYWJJbmRleChlbmFibGVkLCB0aGlzLl9zdGFydEFuY2hvcik7XG4gICAgICB0aGlzLl90b2dnbGVBbmNob3JUYWJJbmRleChlbmFibGVkLCB0aGlzLl9lbmRBbmNob3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFeGVjdXRlcyBhIGZ1bmN0aW9uIHdoZW4gdGhlIHpvbmUgaXMgc3RhYmxlLiAqL1xuICBwcml2YXRlIF9leGVjdXRlT25TdGFibGUoZm46ICgpID0+IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9uZ1pvbmUuaXNTdGFibGUpIHtcbiAgICAgIGZuKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5hc09ic2VydmFibGUoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZShmbik7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRmFjdG9yeSB0aGF0IGFsbG93cyBlYXN5IGluc3RhbnRpYXRpb24gb2YgZm9jdXMgdHJhcHMuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYENvbmZpZ3VyYWJsZUZvY3VzVHJhcEZhY3RvcnlgIGluc3RlYWQuXG4gKiBAYnJlYWtpbmctY2hhbmdlIGZvciAxMS4wLjAgUmVtb3ZlIHRoaXMgY2xhc3MuXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIEZvY3VzVHJhcEZhY3Rvcnkge1xuICBwcml2YXRlIF9kb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9jaGVja2VyOiBJbnRlcmFjdGl2aXR5Q2hlY2tlcixcbiAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnkpIHtcblxuICAgIHRoaXMuX2RvY3VtZW50ID0gX2RvY3VtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmb2N1cy10cmFwcGVkIHJlZ2lvbiBhcm91bmQgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IGFyb3VuZCB3aGljaCBmb2N1cyB3aWxsIGJlIHRyYXBwZWQuXG4gICAqIEBwYXJhbSBkZWZlckNhcHR1cmVFbGVtZW50cyBEZWZlcnMgdGhlIGNyZWF0aW9uIG9mIGZvY3VzLWNhcHR1cmluZyBlbGVtZW50cyB0byBiZSBkb25lXG4gICAqICAgICBtYW51YWxseSBieSB0aGUgdXNlci5cbiAgICogQHJldHVybnMgVGhlIGNyZWF0ZWQgZm9jdXMgdHJhcCBpbnN0YW5jZS5cbiAgICovXG4gIGNyZWF0ZShlbGVtZW50OiBIVE1MRWxlbWVudCwgZGVmZXJDYXB0dXJlRWxlbWVudHM6IGJvb2xlYW4gPSBmYWxzZSk6IEZvY3VzVHJhcCB7XG4gICAgcmV0dXJuIG5ldyBGb2N1c1RyYXAoXG4gICAgICAgIGVsZW1lbnQsIHRoaXMuX2NoZWNrZXIsIHRoaXMuX25nWm9uZSwgdGhpcy5fZG9jdW1lbnQsIGRlZmVyQ2FwdHVyZUVsZW1lbnRzKTtcbiAgfVxufVxuXG4vKiogRGlyZWN0aXZlIGZvciB0cmFwcGluZyBmb2N1cyB3aXRoaW4gYSByZWdpb24uICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2RrVHJhcEZvY3VzXScsXG4gIGV4cG9ydEFzOiAnY2RrVHJhcEZvY3VzJyxcbn0pXG5leHBvcnQgY2xhc3MgQ2RrVHJhcEZvY3VzIGltcGxlbWVudHMgT25EZXN0cm95LCBBZnRlckNvbnRlbnRJbml0LCBEb0NoZWNrIHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIC8qKiBVbmRlcmx5aW5nIEZvY3VzVHJhcCBpbnN0YW5jZS4gKi9cbiAgZm9jdXNUcmFwOiBGb2N1c1RyYXA7XG5cbiAgLyoqIFByZXZpb3VzbHkgZm9jdXNlZCBlbGVtZW50IHRvIHJlc3RvcmUgZm9jdXMgdG8gdXBvbiBkZXN0cm95IHdoZW4gdXNpbmcgYXV0b0NhcHR1cmUuICovXG4gIHByaXZhdGUgX3ByZXZpb3VzbHlGb2N1c2VkRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgZm9jdXMgdHJhcCBpcyBhY3RpdmUuICovXG4gIEBJbnB1dCgnY2RrVHJhcEZvY3VzJylcbiAgZ2V0IGVuYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmZvY3VzVHJhcC5lbmFibGVkOyB9XG4gIHNldCBlbmFibGVkKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuZm9jdXNUcmFwLmVuYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRpcmVjdGl2ZSBzaG91bGQgYXV0b21hdGlhbGx5IG1vdmUgZm9jdXMgaW50byB0aGUgdHJhcHBlZCByZWdpb24gdXBvblxuICAgKiBpbml0aWFsaXphdGlvbiBhbmQgcmV0dXJuIGZvY3VzIHRvIHRoZSBwcmV2aW91cyBhY3RpdmVFbGVtZW50IHVwb24gZGVzdHJ1Y3Rpb24uXG4gICAqL1xuICBASW5wdXQoJ2Nka1RyYXBGb2N1c0F1dG9DYXB0dXJlJylcbiAgZ2V0IGF1dG9DYXB0dXJlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fYXV0b0NhcHR1cmU7IH1cbiAgc2V0IGF1dG9DYXB0dXJlKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2F1dG9DYXB0dXJlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF9hdXRvQ2FwdHVyZTogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgcHJpdmF0ZSBfZm9jdXNUcmFwRmFjdG9yeTogRm9jdXNUcmFwRmFjdG9yeSxcbiAgICAgIEBJbmplY3QoRE9DVU1FTlQpIF9kb2N1bWVudDogYW55KSB7XG5cbiAgICB0aGlzLl9kb2N1bWVudCA9IF9kb2N1bWVudDtcbiAgICB0aGlzLmZvY3VzVHJhcCA9IHRoaXMuX2ZvY3VzVHJhcEZhY3RvcnkuY3JlYXRlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdHJ1ZSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmZvY3VzVHJhcC5kZXN0cm95KCk7XG5cbiAgICAvLyBJZiB3ZSBzdG9yZWQgYSBwcmV2aW91c2x5IGZvY3VzZWQgZWxlbWVudCB3aGVuIHVzaW5nIGF1dG9DYXB0dXJlLCByZXR1cm4gZm9jdXMgdG8gdGhhdFxuICAgIC8vIGVsZW1lbnQgbm93IHRoYXQgdGhlIHRyYXBwZWQgcmVnaW9uIGlzIGJlaW5nIGRlc3Ryb3llZC5cbiAgICBpZiAodGhpcy5fcHJldmlvdXNseUZvY3VzZWRFbGVtZW50KSB7XG4gICAgICB0aGlzLl9wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHRoaXMuX3ByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuZm9jdXNUcmFwLmF0dGFjaEFuY2hvcnMoKTtcblxuICAgIGlmICh0aGlzLmF1dG9DYXB0dXJlKSB7XG4gICAgICB0aGlzLl9wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICAgICAgdGhpcy5mb2N1c1RyYXAuZm9jdXNJbml0aWFsRWxlbWVudFdoZW5SZWFkeSgpO1xuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICBpZiAoIXRoaXMuZm9jdXNUcmFwLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRoaXMuZm9jdXNUcmFwLmF0dGFjaEFuY2hvcnMoKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZW5hYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfYXV0b0NhcHR1cmU6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==