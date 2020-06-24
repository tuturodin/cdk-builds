/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, } from '@angular/core';
import { throwNullPortalOutletError, throwPortalAlreadyAttachedError, throwNoPortalAttachedError, throwNullPortalError, throwPortalOutletAlreadyDisposedError, throwUnknownPortalTypeError } from './portal-errors';
/**
 * A `Portal` is something that you want to render somewhere else.
 * It can be attach to / detached from a `PortalOutlet`.
 */
export class Portal {
    /** Attach this portal to a host. */
    attach(host) {
        if (host == null) {
            throwNullPortalOutletError();
        }
        if (host.hasAttached()) {
            throwPortalAlreadyAttachedError();
        }
        this._attachedHost = host;
        return host.attach(this);
    }
    /** Detach this portal from its host */
    detach() {
        let host = this._attachedHost;
        if (host == null) {
            throwNoPortalAttachedError();
        }
        else {
            this._attachedHost = null;
            host.detach();
        }
    }
    /** Whether this portal is attached to a host. */
    get isAttached() {
        return this._attachedHost != null;
    }
    /**
     * Sets the PortalOutlet reference without performing `attach()`. This is used directly by
     * the PortalOutlet when it is performing an `attach()` or `detach()`.
     */
    setAttachedHost(host) {
        this._attachedHost = host;
    }
}
/**
 * A `ComponentPortal` is a portal that instantiates some Component upon attachment.
 */
export class ComponentPortal extends Portal {
    constructor(component, viewContainerRef, injector, componentFactoryResolver) {
        super();
        this.component = component;
        this.viewContainerRef = viewContainerRef;
        this.injector = injector;
        this.componentFactoryResolver = componentFactoryResolver;
    }
}
/**
 * A `TemplatePortal` is a portal that represents some embedded template (TemplateRef).
 */
export class TemplatePortal extends Portal {
    constructor(template, viewContainerRef, context) {
        super();
        this.templateRef = template;
        this.viewContainerRef = viewContainerRef;
        this.context = context;
    }
    get origin() {
        return this.templateRef.elementRef;
    }
    /**
     * Attach the portal to the provided `PortalOutlet`.
     * When a context is provided it will override the `context` property of the `TemplatePortal`
     * instance.
     */
    attach(host, context = this.context) {
        this.context = context;
        return super.attach(host);
    }
    detach() {
        this.context = undefined;
        return super.detach();
    }
}
/**
 * A `DomPortal` is a portal whose DOM element will be taken from its current position
 * in the DOM and moved into a portal outlet, when it is attached. On detach, the content
 * will be restored to its original position.
 */
export class DomPortal extends Portal {
    constructor(element) {
        super();
        this.element = element instanceof ElementRef ? element.nativeElement : element;
    }
}
/**
 * Partial implementation of PortalOutlet that handles attaching
 * ComponentPortal and TemplatePortal.
 */
export class BasePortalOutlet {
    constructor() {
        /** Whether this host has already been permanently disposed. */
        this._isDisposed = false;
        // @breaking-change 10.0.0-sha-d3f287d65 `attachDomPortal` to become a required abstract method.
        this.attachDomPortal = null;
    }
    /** Whether this host has an attached portal. */
    hasAttached() {
        return !!this._attachedPortal;
    }
    /** Attaches a portal. */
    attach(portal) {
        if (!portal) {
            throwNullPortalError();
        }
        if (this.hasAttached()) {
            throwPortalAlreadyAttachedError();
        }
        if (this._isDisposed) {
            throwPortalOutletAlreadyDisposedError();
        }
        if (portal instanceof ComponentPortal) {
            this._attachedPortal = portal;
            return this.attachComponentPortal(portal);
        }
        else if (portal instanceof TemplatePortal) {
            this._attachedPortal = portal;
            return this.attachTemplatePortal(portal);
            // @breaking-change 10.0.0-sha-d3f287d65 remove null check for `this.attachDomPortal`.
        }
        else if (this.attachDomPortal && portal instanceof DomPortal) {
            this._attachedPortal = portal;
            return this.attachDomPortal(portal);
        }
        throwUnknownPortalTypeError();
    }
    /** Detaches a previously attached portal. */
    detach() {
        if (this._attachedPortal) {
            this._attachedPortal.setAttachedHost(null);
            this._attachedPortal = null;
        }
        this._invokeDisposeFn();
    }
    /** Permanently dispose of this portal host. */
    dispose() {
        if (this.hasAttached()) {
            this.detach();
        }
        this._invokeDisposeFn();
        this._isDisposed = true;
    }
    /** @docs-private */
    setDisposeFn(fn) {
        this._disposeFn = fn;
    }
    _invokeDisposeFn() {
        if (this._disposeFn) {
            this._disposeFn();
            this._disposeFn = null;
        }
    }
}
/**
 * @deprecated Use `BasePortalOutlet` instead.
 * @breaking-change 9.0.0
 */
export class BasePortalHost extends BasePortalOutlet {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9ydGFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9wb3J0YWwvcG9ydGFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFHSCxVQUFVLEdBS2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNILDBCQUEwQixFQUMxQiwrQkFBK0IsRUFDL0IsMEJBQTBCLEVBQzFCLG9CQUFvQixFQUNwQixxQ0FBcUMsRUFDckMsMkJBQTJCLEVBQzlCLE1BQU0saUJBQWlCLENBQUM7QUFPekI7OztHQUdHO0FBQ0gsTUFBTSxPQUFnQixNQUFNO0lBRzFCLG9DQUFvQztJQUNwQyxNQUFNLENBQUMsSUFBa0I7UUFDdkIsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO1lBQ2hCLDBCQUEwQixFQUFFLENBQUM7U0FDOUI7UUFFRCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUN0QiwrQkFBK0IsRUFBRSxDQUFDO1NBQ25DO1FBRUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDMUIsT0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCx1Q0FBdUM7SUFDdkMsTUFBTTtRQUNKLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFFOUIsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO1lBQ2hCLDBCQUEwQixFQUFFLENBQUM7U0FDOUI7YUFBTTtZQUNMLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBQzFCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNmO0lBQ0gsQ0FBQztJQUVELGlEQUFpRDtJQUNqRCxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxlQUFlLENBQUMsSUFBeUI7UUFDdkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7SUFDNUIsQ0FBQztDQUNGO0FBR0Q7O0dBRUc7QUFDSCxNQUFNLE9BQU8sZUFBbUIsU0FBUSxNQUF1QjtJQW9CN0QsWUFDSSxTQUEyQixFQUMzQixnQkFBMEMsRUFDMUMsUUFBMEIsRUFDMUIsd0JBQTBEO1FBQzVELEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO1FBQ3pDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyx3QkFBd0IsR0FBRyx3QkFBd0IsQ0FBQztJQUMzRCxDQUFDO0NBQ0Y7QUFFRDs7R0FFRztBQUNILE1BQU0sT0FBTyxjQUF3QixTQUFRLE1BQTBCO0lBVXJFLFlBQVksUUFBd0IsRUFBRSxnQkFBa0MsRUFBRSxPQUFXO1FBQ25GLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7UUFDNUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO1FBQ3pDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLElBQWtCLEVBQUUsVUFBeUIsSUFBSSxDQUFDLE9BQU87UUFDOUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7UUFDekIsT0FBTyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDeEIsQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sT0FBTyxTQUEyQixTQUFRLE1BQVM7SUFJdkQsWUFBWSxPQUEwQjtRQUNwQyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxZQUFZLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ2pGLENBQUM7Q0FDRjtBQXdCRDs7O0dBR0c7QUFDSCxNQUFNLE9BQWdCLGdCQUFnQjtJQUF0QztRQU9FLCtEQUErRDtRQUN2RCxnQkFBVyxHQUFZLEtBQUssQ0FBQztRQTRDckMsa0ZBQWtGO1FBQ3pFLG9CQUFlLEdBQXdDLElBQUksQ0FBQztJQWlDdkUsQ0FBQztJQTVFQyxnREFBZ0Q7SUFDaEQsV0FBVztRQUNULE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDaEMsQ0FBQztJQU1ELHlCQUF5QjtJQUN6QixNQUFNLENBQUMsTUFBbUI7UUFDeEIsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLG9CQUFvQixFQUFFLENBQUM7U0FDeEI7UUFFRCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUN0QiwrQkFBK0IsRUFBRSxDQUFDO1NBQ25DO1FBRUQsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLHFDQUFxQyxFQUFFLENBQUM7U0FDekM7UUFFRCxJQUFJLE1BQU0sWUFBWSxlQUFlLEVBQUU7WUFDckMsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7WUFDOUIsT0FBTyxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDM0M7YUFBTSxJQUFJLE1BQU0sWUFBWSxjQUFjLEVBQUU7WUFDM0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7WUFDOUIsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekMsd0VBQXdFO1NBQ3pFO2FBQU0sSUFBSSxJQUFJLENBQUMsZUFBZSxJQUFJLE1BQU0sWUFBWSxTQUFTLEVBQUU7WUFDOUQsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7WUFDOUIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3JDO1FBRUQsMkJBQTJCLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBU0QsNkNBQTZDO0lBQzdDLE1BQU07UUFDSixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDeEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7U0FDN0I7UUFFRCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsK0NBQStDO0lBQy9DLE9BQU87UUFDTCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUN0QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDZjtRQUVELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQzFCLENBQUM7SUFFRCxvQkFBb0I7SUFDcEIsWUFBWSxDQUFDLEVBQWM7UUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVPLGdCQUFnQjtRQUN0QixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztDQUNGO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxPQUFnQixjQUFlLFNBQVEsZ0JBQWdCO0NBQUciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBWaWV3Q29udGFpbmVyUmVmLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgQ29tcG9uZW50UmVmLFxuICAgIEVtYmVkZGVkVmlld1JlZixcbiAgICBJbmplY3RvcixcbiAgICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgICB0aHJvd051bGxQb3J0YWxPdXRsZXRFcnJvcixcbiAgICB0aHJvd1BvcnRhbEFscmVhZHlBdHRhY2hlZEVycm9yLFxuICAgIHRocm93Tm9Qb3J0YWxBdHRhY2hlZEVycm9yLFxuICAgIHRocm93TnVsbFBvcnRhbEVycm9yLFxuICAgIHRocm93UG9ydGFsT3V0bGV0QWxyZWFkeURpc3Bvc2VkRXJyb3IsXG4gICAgdGhyb3dVbmtub3duUG9ydGFsVHlwZUVycm9yXG59IGZyb20gJy4vcG9ydGFsLWVycm9ycyc7XG5cbi8qKiBJbnRlcmZhY2UgdGhhdCBjYW4gYmUgdXNlZCB0byBnZW5lcmljYWxseSB0eXBlIGEgY2xhc3MuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudFR5cGU8VD4ge1xuICBuZXcgKC4uLmFyZ3M6IGFueVtdKTogVDtcbn1cblxuLyoqXG4gKiBBIGBQb3J0YWxgIGlzIHNvbWV0aGluZyB0aGF0IHlvdSB3YW50IHRvIHJlbmRlciBzb21ld2hlcmUgZWxzZS5cbiAqIEl0IGNhbiBiZSBhdHRhY2ggdG8gLyBkZXRhY2hlZCBmcm9tIGEgYFBvcnRhbE91dGxldGAuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQb3J0YWw8VD4ge1xuICBwcml2YXRlIF9hdHRhY2hlZEhvc3Q6IFBvcnRhbE91dGxldCB8IG51bGw7XG5cbiAgLyoqIEF0dGFjaCB0aGlzIHBvcnRhbCB0byBhIGhvc3QuICovXG4gIGF0dGFjaChob3N0OiBQb3J0YWxPdXRsZXQpOiBUIHtcbiAgICBpZiAoaG9zdCA9PSBudWxsKSB7XG4gICAgICB0aHJvd051bGxQb3J0YWxPdXRsZXRFcnJvcigpO1xuICAgIH1cblxuICAgIGlmIChob3N0Lmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRocm93UG9ydGFsQWxyZWFkeUF0dGFjaGVkRXJyb3IoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9hdHRhY2hlZEhvc3QgPSBob3N0O1xuICAgIHJldHVybiA8VD4gaG9zdC5hdHRhY2godGhpcyk7XG4gIH1cblxuICAvKiogRGV0YWNoIHRoaXMgcG9ydGFsIGZyb20gaXRzIGhvc3QgKi9cbiAgZGV0YWNoKCk6IHZvaWQge1xuICAgIGxldCBob3N0ID0gdGhpcy5fYXR0YWNoZWRIb3N0O1xuXG4gICAgaWYgKGhvc3QgPT0gbnVsbCkge1xuICAgICAgdGhyb3dOb1BvcnRhbEF0dGFjaGVkRXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYXR0YWNoZWRIb3N0ID0gbnVsbDtcbiAgICAgIGhvc3QuZGV0YWNoKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBwb3J0YWwgaXMgYXR0YWNoZWQgdG8gYSBob3N0LiAqL1xuICBnZXQgaXNBdHRhY2hlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoZWRIb3N0ICE9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgUG9ydGFsT3V0bGV0IHJlZmVyZW5jZSB3aXRob3V0IHBlcmZvcm1pbmcgYGF0dGFjaCgpYC4gVGhpcyBpcyB1c2VkIGRpcmVjdGx5IGJ5XG4gICAqIHRoZSBQb3J0YWxPdXRsZXQgd2hlbiBpdCBpcyBwZXJmb3JtaW5nIGFuIGBhdHRhY2goKWAgb3IgYGRldGFjaCgpYC5cbiAgICovXG4gIHNldEF0dGFjaGVkSG9zdChob3N0OiBQb3J0YWxPdXRsZXQgfCBudWxsKSB7XG4gICAgdGhpcy5fYXR0YWNoZWRIb3N0ID0gaG9zdDtcbiAgfVxufVxuXG5cbi8qKlxuICogQSBgQ29tcG9uZW50UG9ydGFsYCBpcyBhIHBvcnRhbCB0aGF0IGluc3RhbnRpYXRlcyBzb21lIENvbXBvbmVudCB1cG9uIGF0dGFjaG1lbnQuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb21wb25lbnRQb3J0YWw8VD4gZXh0ZW5kcyBQb3J0YWw8Q29tcG9uZW50UmVmPFQ+PiB7XG4gIC8qKiBUaGUgdHlwZSBvZiB0aGUgY29tcG9uZW50IHRoYXQgd2lsbCBiZSBpbnN0YW50aWF0ZWQgZm9yIGF0dGFjaG1lbnQuICovXG4gIGNvbXBvbmVudDogQ29tcG9uZW50VHlwZTxUPjtcblxuICAvKipcbiAgICogW09wdGlvbmFsXSBXaGVyZSB0aGUgYXR0YWNoZWQgY29tcG9uZW50IHNob3VsZCBsaXZlIGluIEFuZ3VsYXIncyAqbG9naWNhbCogY29tcG9uZW50IHRyZWUuXG4gICAqIFRoaXMgaXMgZGlmZmVyZW50IGZyb20gd2hlcmUgdGhlIGNvbXBvbmVudCAqcmVuZGVycyosIHdoaWNoIGlzIGRldGVybWluZWQgYnkgdGhlIFBvcnRhbE91dGxldC5cbiAgICogVGhlIG9yaWdpbiBpcyBuZWNlc3Nhcnkgd2hlbiB0aGUgaG9zdCBpcyBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyIGFwcGxpY2F0aW9uIGNvbnRleHQuXG4gICAqL1xuICB2aWV3Q29udGFpbmVyUmVmPzogVmlld0NvbnRhaW5lclJlZiB8IG51bGw7XG5cbiAgLyoqIFtPcHRpb25hbF0gSW5qZWN0b3IgdXNlZCBmb3IgdGhlIGluc3RhbnRpYXRpb24gb2YgdGhlIGNvbXBvbmVudC4gKi9cbiAgaW5qZWN0b3I/OiBJbmplY3RvciB8IG51bGw7XG5cbiAgLyoqXG4gICAqIEFsdGVybmF0ZSBgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyYCB0byB1c2Ugd2hlbiByZXNvbHZpbmcgdGhlIGFzc29jaWF0ZWQgY29tcG9uZW50LlxuICAgKiBEZWZhdWx0cyB0byB1c2luZyB0aGUgcmVzb2x2ZXIgZnJvbSB0aGUgb3V0bGV0IHRoYXQgdGhlIHBvcnRhbCBpcyBhdHRhY2hlZCB0by5cbiAgICovXG4gIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcj86IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBjb21wb25lbnQ6IENvbXBvbmVudFR5cGU8VD4sXG4gICAgICB2aWV3Q29udGFpbmVyUmVmPzogVmlld0NvbnRhaW5lclJlZiB8IG51bGwsXG4gICAgICBpbmplY3Rvcj86IEluamVjdG9yIHwgbnVsbCxcbiAgICAgIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcj86IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciB8IG51bGwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY29tcG9uZW50ID0gY29tcG9uZW50O1xuICAgIHRoaXMudmlld0NvbnRhaW5lclJlZiA9IHZpZXdDb250YWluZXJSZWY7XG4gICAgdGhpcy5pbmplY3RvciA9IGluamVjdG9yO1xuICAgIHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyID0gY29tcG9uZW50RmFjdG9yeVJlc29sdmVyO1xuICB9XG59XG5cbi8qKlxuICogQSBgVGVtcGxhdGVQb3J0YWxgIGlzIGEgcG9ydGFsIHRoYXQgcmVwcmVzZW50cyBzb21lIGVtYmVkZGVkIHRlbXBsYXRlIChUZW1wbGF0ZVJlZikuXG4gKi9cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZVBvcnRhbDxDID0gYW55PiBleHRlbmRzIFBvcnRhbDxFbWJlZGRlZFZpZXdSZWY8Qz4+IHtcbiAgLyoqIFRoZSBlbWJlZGRlZCB0ZW1wbGF0ZSB0aGF0IHdpbGwgYmUgdXNlZCB0byBpbnN0YW50aWF0ZSBhbiBlbWJlZGRlZCBWaWV3IGluIHRoZSBob3N0LiAqL1xuICB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8Qz47XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgVmlld0NvbnRhaW5lciBpbnRvIHdoaWNoIHRoZSB0ZW1wbGF0ZSB3aWxsIGJlIHN0YW1wZWQgb3V0LiAqL1xuICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmO1xuXG4gIC8qKiBDb250ZXh0dWFsIGRhdGEgdG8gYmUgcGFzc2VkIGluIHRvIHRoZSBlbWJlZGRlZCB2aWV3LiAqL1xuICBjb250ZXh0OiBDIHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxDPiwgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZiwgY29udGV4dD86IEMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudGVtcGxhdGVSZWYgPSB0ZW1wbGF0ZTtcbiAgICB0aGlzLnZpZXdDb250YWluZXJSZWYgPSB2aWV3Q29udGFpbmVyUmVmO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIH1cblxuICBnZXQgb3JpZ2luKCk6IEVsZW1lbnRSZWYge1xuICAgIHJldHVybiB0aGlzLnRlbXBsYXRlUmVmLmVsZW1lbnRSZWY7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoIHRoZSBwb3J0YWwgdG8gdGhlIHByb3ZpZGVkIGBQb3J0YWxPdXRsZXRgLlxuICAgKiBXaGVuIGEgY29udGV4dCBpcyBwcm92aWRlZCBpdCB3aWxsIG92ZXJyaWRlIHRoZSBgY29udGV4dGAgcHJvcGVydHkgb2YgdGhlIGBUZW1wbGF0ZVBvcnRhbGBcbiAgICogaW5zdGFuY2UuXG4gICAqL1xuICBhdHRhY2goaG9zdDogUG9ydGFsT3V0bGV0LCBjb250ZXh0OiBDIHwgdW5kZWZpbmVkID0gdGhpcy5jb250ZXh0KTogRW1iZWRkZWRWaWV3UmVmPEM+IHtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgIHJldHVybiBzdXBlci5hdHRhY2goaG9zdCk7XG4gIH1cblxuICBkZXRhY2goKTogdm9pZCB7XG4gICAgdGhpcy5jb250ZXh0ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdXBlci5kZXRhY2goKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgYERvbVBvcnRhbGAgaXMgYSBwb3J0YWwgd2hvc2UgRE9NIGVsZW1lbnQgd2lsbCBiZSB0YWtlbiBmcm9tIGl0cyBjdXJyZW50IHBvc2l0aW9uXG4gKiBpbiB0aGUgRE9NIGFuZCBtb3ZlZCBpbnRvIGEgcG9ydGFsIG91dGxldCwgd2hlbiBpdCBpcyBhdHRhY2hlZC4gT24gZGV0YWNoLCB0aGUgY29udGVudFxuICogd2lsbCBiZSByZXN0b3JlZCB0byBpdHMgb3JpZ2luYWwgcG9zaXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBEb21Qb3J0YWw8VCA9IEhUTUxFbGVtZW50PiBleHRlbmRzIFBvcnRhbDxUPiB7XG4gIC8qKiBET00gbm9kZSBob3N0aW5nIHRoZSBwb3J0YWwncyBjb250ZW50LiAqL1xuICByZWFkb25seSBlbGVtZW50OiBUO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IFQgfCBFbGVtZW50UmVmPFQ+KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudFJlZiA/IGVsZW1lbnQubmF0aXZlRWxlbWVudCA6IGVsZW1lbnQ7XG4gIH1cbn1cblxuXG4vKiogQSBgUG9ydGFsT3V0bGV0YCBpcyBhbiBzcGFjZSB0aGF0IGNhbiBjb250YWluIGEgc2luZ2xlIGBQb3J0YWxgLiAqL1xuZXhwb3J0IGludGVyZmFjZSBQb3J0YWxPdXRsZXQge1xuICAvKiogQXR0YWNoZXMgYSBwb3J0YWwgdG8gdGhpcyBvdXRsZXQuICovXG4gIGF0dGFjaChwb3J0YWw6IFBvcnRhbDxhbnk+KTogYW55O1xuXG4gIC8qKiBEZXRhY2hlcyB0aGUgY3VycmVudGx5IGF0dGFjaGVkIHBvcnRhbCBmcm9tIHRoaXMgb3V0bGV0LiAqL1xuICBkZXRhY2goKTogYW55O1xuXG4gIC8qKiBQZXJmb3JtcyBjbGVhbnVwIGJlZm9yZSB0aGUgb3V0bGV0IGlzIGRlc3Ryb3llZC4gKi9cbiAgZGlzcG9zZSgpOiB2b2lkO1xuXG4gIC8qKiBXaGV0aGVyIHRoZXJlIGlzIGN1cnJlbnRseSBhIHBvcnRhbCBhdHRhY2hlZCB0byB0aGlzIG91dGxldC4gKi9cbiAgaGFzQXR0YWNoZWQoKTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYFBvcnRhbE91dGxldGAgaW5zdGVhZC5cbiAqIEBicmVha2luZy1jaGFuZ2UgOS4wLjBcbiAqL1xuZXhwb3J0IHR5cGUgUG9ydGFsSG9zdCA9IFBvcnRhbE91dGxldDtcblxuLyoqXG4gKiBQYXJ0aWFsIGltcGxlbWVudGF0aW9uIG9mIFBvcnRhbE91dGxldCB0aGF0IGhhbmRsZXMgYXR0YWNoaW5nXG4gKiBDb21wb25lbnRQb3J0YWwgYW5kIFRlbXBsYXRlUG9ydGFsLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZVBvcnRhbE91dGxldCBpbXBsZW1lbnRzIFBvcnRhbE91dGxldCB7XG4gIC8qKiBUaGUgcG9ydGFsIGN1cnJlbnRseSBhdHRhY2hlZCB0byB0aGUgaG9zdC4gKi9cbiAgcHJvdGVjdGVkIF9hdHRhY2hlZFBvcnRhbDogUG9ydGFsPGFueT4gfCBudWxsO1xuXG4gIC8qKiBBIGZ1bmN0aW9uIHRoYXQgd2lsbCBwZXJtYW5lbnRseSBkaXNwb3NlIHRoaXMgaG9zdC4gKi9cbiAgcHJpdmF0ZSBfZGlzcG9zZUZuOiAoKCkgPT4gdm9pZCkgfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgaG9zdCBoYXMgYWxyZWFkeSBiZWVuIHBlcm1hbmVudGx5IGRpc3Bvc2VkLiAqL1xuICBwcml2YXRlIF9pc0Rpc3Bvc2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBob3N0IGhhcyBhbiBhdHRhY2hlZCBwb3J0YWwuICovXG4gIGhhc0F0dGFjaGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuX2F0dGFjaGVkUG9ydGFsO1xuICB9XG5cbiAgYXR0YWNoPFQ+KHBvcnRhbDogQ29tcG9uZW50UG9ydGFsPFQ+KTogQ29tcG9uZW50UmVmPFQ+O1xuICBhdHRhY2g8VD4ocG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDxUPik6IEVtYmVkZGVkVmlld1JlZjxUPjtcbiAgYXR0YWNoKHBvcnRhbDogYW55KTogYW55O1xuXG4gIC8qKiBBdHRhY2hlcyBhIHBvcnRhbC4gKi9cbiAgYXR0YWNoKHBvcnRhbDogUG9ydGFsPGFueT4pOiBhbnkge1xuICAgIGlmICghcG9ydGFsKSB7XG4gICAgICB0aHJvd051bGxQb3J0YWxFcnJvcigpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRocm93UG9ydGFsQWxyZWFkeUF0dGFjaGVkRXJyb3IoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5faXNEaXNwb3NlZCkge1xuICAgICAgdGhyb3dQb3J0YWxPdXRsZXRBbHJlYWR5RGlzcG9zZWRFcnJvcigpO1xuICAgIH1cblxuICAgIGlmIChwb3J0YWwgaW5zdGFuY2VvZiBDb21wb25lbnRQb3J0YWwpIHtcbiAgICAgIHRoaXMuX2F0dGFjaGVkUG9ydGFsID0gcG9ydGFsO1xuICAgICAgcmV0dXJuIHRoaXMuYXR0YWNoQ29tcG9uZW50UG9ydGFsKHBvcnRhbCk7XG4gICAgfSBlbHNlIGlmIChwb3J0YWwgaW5zdGFuY2VvZiBUZW1wbGF0ZVBvcnRhbCkge1xuICAgICAgdGhpcy5fYXR0YWNoZWRQb3J0YWwgPSBwb3J0YWw7XG4gICAgICByZXR1cm4gdGhpcy5hdHRhY2hUZW1wbGF0ZVBvcnRhbChwb3J0YWwpO1xuICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMC4wLjAgcmVtb3ZlIG51bGwgY2hlY2sgZm9yIGB0aGlzLmF0dGFjaERvbVBvcnRhbGAuXG4gICAgfSBlbHNlIGlmICh0aGlzLmF0dGFjaERvbVBvcnRhbCAmJiBwb3J0YWwgaW5zdGFuY2VvZiBEb21Qb3J0YWwpIHtcbiAgICAgIHRoaXMuX2F0dGFjaGVkUG9ydGFsID0gcG9ydGFsO1xuICAgICAgcmV0dXJuIHRoaXMuYXR0YWNoRG9tUG9ydGFsKHBvcnRhbCk7XG4gICAgfVxuXG4gICAgdGhyb3dVbmtub3duUG9ydGFsVHlwZUVycm9yKCk7XG4gIH1cblxuICBhYnN0cmFjdCBhdHRhY2hDb21wb25lbnRQb3J0YWw8VD4ocG9ydGFsOiBDb21wb25lbnRQb3J0YWw8VD4pOiBDb21wb25lbnRSZWY8VD47XG5cbiAgYWJzdHJhY3QgYXR0YWNoVGVtcGxhdGVQb3J0YWw8Qz4ocG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDxDPik6IEVtYmVkZGVkVmlld1JlZjxDPjtcblxuICAvLyBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMCBgYXR0YWNoRG9tUG9ydGFsYCB0byBiZWNvbWUgYSByZXF1aXJlZCBhYnN0cmFjdCBtZXRob2QuXG4gIHJlYWRvbmx5IGF0dGFjaERvbVBvcnRhbDogbnVsbCB8ICgocG9ydGFsOiBEb21Qb3J0YWwpID0+IGFueSkgPSBudWxsO1xuXG4gIC8qKiBEZXRhY2hlcyBhIHByZXZpb3VzbHkgYXR0YWNoZWQgcG9ydGFsLiAqL1xuICBkZXRhY2goKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2F0dGFjaGVkUG9ydGFsKSB7XG4gICAgICB0aGlzLl9hdHRhY2hlZFBvcnRhbC5zZXRBdHRhY2hlZEhvc3QobnVsbCk7XG4gICAgICB0aGlzLl9hdHRhY2hlZFBvcnRhbCA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5faW52b2tlRGlzcG9zZUZuKCk7XG4gIH1cblxuICAvKiogUGVybWFuZW50bHkgZGlzcG9zZSBvZiB0aGlzIHBvcnRhbCBob3N0LiAqL1xuICBkaXNwb3NlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRoaXMuZGV0YWNoKCk7XG4gICAgfVxuXG4gICAgdGhpcy5faW52b2tlRGlzcG9zZUZuKCk7XG4gICAgdGhpcy5faXNEaXNwb3NlZCA9IHRydWU7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBzZXREaXNwb3NlRm4oZm46ICgpID0+IHZvaWQpIHtcbiAgICB0aGlzLl9kaXNwb3NlRm4gPSBmbjtcbiAgfVxuXG4gIHByaXZhdGUgX2ludm9rZURpc3Bvc2VGbigpIHtcbiAgICBpZiAodGhpcy5fZGlzcG9zZUZuKSB7XG4gICAgICB0aGlzLl9kaXNwb3NlRm4oKTtcbiAgICAgIHRoaXMuX2Rpc3Bvc2VGbiA9IG51bGw7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBCYXNlUG9ydGFsT3V0bGV0YCBpbnN0ZWFkLlxuICogQGJyZWFraW5nLWNoYW5nZSA5LjAuMFxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZVBvcnRhbEhvc3QgZXh0ZW5kcyBCYXNlUG9ydGFsT3V0bGV0IHt9XG4iXX0=