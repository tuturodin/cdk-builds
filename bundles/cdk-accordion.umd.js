/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/cdk/collections'), require('@angular/cdk/coercion'), require('rxjs/Subject'), require('rxjs/Subscription')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/cdk/collections', '@angular/cdk/coercion', 'rxjs/Subject', 'rxjs/Subscription'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.cdk = global.ng.cdk || {}, global.ng.cdk.accordion = global.ng.cdk.accordion || {}),global.ng.core,global.ng.cdk.collections,global.ng.cdk.coercion,global.Rx,global.Rx));
}(this, (function (exports,_angular_core,_angular_cdk_collections,_angular_cdk_coercion,rxjs_Subject,rxjs_Subscription) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Used to generate unique ID for each accordion.
 */
var nextId$1 = 0;
/**
 * Directive whose purpose is to manage the expanded state of CdkAccordionItem children.
 */
var CdkAccordion = /** @class */ (function () {
    function CdkAccordion() {
        /**
         * Stream that emits true/false when openAll/closeAll is triggered.
         */
        this._openCloseAllActions = new rxjs_Subject.Subject();
        /**
         * A readonly id value to use for unique selection coordination.
         */
        this.id = "cdk-accordion-" + nextId$1++;
        this._multi = false;
    }
    Object.defineProperty(CdkAccordion.prototype, "multi", {
        get: /**
         * Whether the accordion should allow multiple expanded accordion items simultaneously.
         * @return {?}
         */
        function () { return this._multi; },
        set: /**
         * @param {?} multi
         * @return {?}
         */
        function (multi) { this._multi = _angular_cdk_coercion.coerceBooleanProperty(multi); },
        enumerable: true,
        configurable: true
    });
    /** Opens all enabled accordion items in an accordion where multi is enabled. */
    /**
     * Opens all enabled accordion items in an accordion where multi is enabled.
     * @return {?}
     */
    CdkAccordion.prototype.openAll = /**
     * Opens all enabled accordion items in an accordion where multi is enabled.
     * @return {?}
     */
    function () {
        this._openCloseAll(true);
    };
    /** Closes all enabled accordion items in an accordion where multi is enabled. */
    /**
     * Closes all enabled accordion items in an accordion where multi is enabled.
     * @return {?}
     */
    CdkAccordion.prototype.closeAll = /**
     * Closes all enabled accordion items in an accordion where multi is enabled.
     * @return {?}
     */
    function () {
        this._openCloseAll(false);
    };
    /**
     * @param {?} expanded
     * @return {?}
     */
    CdkAccordion.prototype._openCloseAll = /**
     * @param {?} expanded
     * @return {?}
     */
    function (expanded) {
        if (this.multi) {
            this._openCloseAllActions.next(expanded);
        }
    };
    CdkAccordion.decorators = [
        { type: _angular_core.Directive, args: [{
                    selector: 'cdk-accordion, [cdkAccordion]',
                    exportAs: 'cdkAccordion',
                },] },
    ];
    /** @nocollapse */
    CdkAccordion.ctorParameters = function () { return []; };
    CdkAccordion.propDecorators = {
        "multi": [{ type: _angular_core.Input },],
    };
    return CdkAccordion;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Used to generate unique ID for each accordion item.
 */
var nextId = 0;
/**
 * An basic directive expected to be extended and decorated as a component.  Sets up all
 * events and attributes needed to be managed by a CdkAccordion parent.
 */
var CdkAccordionItem = /** @class */ (function () {
    function CdkAccordionItem(accordion, _changeDetectorRef, _expansionDispatcher) {
        var _this = this;
        this.accordion = accordion;
        this._changeDetectorRef = _changeDetectorRef;
        this._expansionDispatcher = _expansionDispatcher;
        /**
         * Subscription to openAll/closeAll events.
         */
        this._openCloseAllSubscription = rxjs_Subscription.Subscription.EMPTY;
        /**
         * Event emitted every time the AccordionItem is closed.
         */
        this.closed = new _angular_core.EventEmitter();
        /**
         * Event emitted every time the AccordionItem is opened.
         */
        this.opened = new _angular_core.EventEmitter();
        /**
         * Event emitted when the AccordionItem is destroyed.
         */
        this.destroyed = new _angular_core.EventEmitter();
        /**
         * Emits whenever the expanded state of the accordion changes.
         * Primarily used to facilitate two-way binding.
         * \@docs-private
         */
        this.expandedChange = new _angular_core.EventEmitter();
        /**
         * The unique AccordionItem id.
         */
        this.id = "cdk-accordion-child-" + nextId++;
        this._expanded = false;
        this._disabled = false;
        /**
         * Unregister function for _expansionDispatcher.
         */
        this._removeUniqueSelectionListener = function () { };
        this._removeUniqueSelectionListener =
            _expansionDispatcher.listen(function (id, accordionId) {
                if (_this.accordion && !_this.accordion.multi &&
                    _this.accordion.id === accordionId && _this.id !== id) {
                    _this.expanded = false;
                }
            });
        // When an accordion item is hosted in an accordion, subscribe to open/close events.
        if (this.accordion) {
            this._openCloseAllSubscription = this._subscribeToOpenCloseAllActions();
        }
    }
    Object.defineProperty(CdkAccordionItem.prototype, "expanded", {
        get: /**
         * Whether the AccordionItem is expanded.
         * @return {?}
         */
        function () { return this._expanded; },
        set: /**
         * @param {?} expanded
         * @return {?}
         */
        function (expanded) {
            expanded = _angular_cdk_coercion.coerceBooleanProperty(expanded);
            // Only emit events and update the internal value if the value changes.
            if (this._expanded !== expanded) {
                this._expanded = expanded;
                this.expandedChange.emit(expanded);
                if (expanded) {
                    this.opened.emit();
                    /**
                     * In the unique selection dispatcher, the id parameter is the id of the CdkAccordionItem,
                     * the name value is the id of the accordion.
                     */
                    var /** @type {?} */ accordionId = this.accordion ? this.accordion.id : this.id;
                    this._expansionDispatcher.notify(this.id, accordionId);
                }
                else {
                    this.closed.emit();
                }
                // Ensures that the animation will run when the value is set outside of an `@Input`.
                // This includes cases like the open, close and toggle methods.
                this._changeDetectorRef.markForCheck();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkAccordionItem.prototype, "disabled", {
        get: /**
         * Whether the AccordionItem is disabled.
         * @return {?}
         */
        function () { return this._disabled; },
        set: /**
         * @param {?} disabled
         * @return {?}
         */
        function (disabled) { this._disabled = _angular_cdk_coercion.coerceBooleanProperty(disabled); },
        enumerable: true,
        configurable: true
    });
    /** Emits an event for the accordion item being destroyed. */
    /**
     * Emits an event for the accordion item being destroyed.
     * @return {?}
     */
    CdkAccordionItem.prototype.ngOnDestroy = /**
     * Emits an event for the accordion item being destroyed.
     * @return {?}
     */
    function () {
        this.destroyed.emit();
        this._removeUniqueSelectionListener();
        this._openCloseAllSubscription.unsubscribe();
    };
    /** Toggles the expanded state of the accordion item. */
    /**
     * Toggles the expanded state of the accordion item.
     * @return {?}
     */
    CdkAccordionItem.prototype.toggle = /**
     * Toggles the expanded state of the accordion item.
     * @return {?}
     */
    function () {
        if (!this.disabled) {
            this.expanded = !this.expanded;
        }
    };
    /** Sets the expanded state of the accordion item to false. */
    /**
     * Sets the expanded state of the accordion item to false.
     * @return {?}
     */
    CdkAccordionItem.prototype.close = /**
     * Sets the expanded state of the accordion item to false.
     * @return {?}
     */
    function () {
        if (!this.disabled) {
            this.expanded = false;
        }
    };
    /** Sets the expanded state of the accordion item to true. */
    /**
     * Sets the expanded state of the accordion item to true.
     * @return {?}
     */
    CdkAccordionItem.prototype.open = /**
     * Sets the expanded state of the accordion item to true.
     * @return {?}
     */
    function () {
        if (!this.disabled) {
            this.expanded = true;
        }
    };
    /**
     * @return {?}
     */
    CdkAccordionItem.prototype._subscribeToOpenCloseAllActions = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return this.accordion._openCloseAllActions.subscribe(function (expanded) {
            // Only change expanded state if item is enabled
            if (!_this.disabled) {
                _this.expanded = expanded;
            }
        });
    };
    CdkAccordionItem.decorators = [
        { type: _angular_core.Directive, args: [{
                    selector: 'cdk-accordion-item',
                    exportAs: 'cdkAccordionItem',
                },] },
    ];
    /** @nocollapse */
    CdkAccordionItem.ctorParameters = function () { return [
        { type: CdkAccordion, decorators: [{ type: _angular_core.Optional },] },
        { type: _angular_core.ChangeDetectorRef, },
        { type: _angular_cdk_collections.UniqueSelectionDispatcher, },
    ]; };
    CdkAccordionItem.propDecorators = {
        "closed": [{ type: _angular_core.Output },],
        "opened": [{ type: _angular_core.Output },],
        "destroyed": [{ type: _angular_core.Output },],
        "expandedChange": [{ type: _angular_core.Output },],
        "expanded": [{ type: _angular_core.Input },],
        "disabled": [{ type: _angular_core.Input },],
    };
    return CdkAccordionItem;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var CdkAccordionModule = /** @class */ (function () {
    function CdkAccordionModule() {
    }
    CdkAccordionModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    exports: [CdkAccordion, CdkAccordionItem],
                    declarations: [CdkAccordion, CdkAccordionItem],
                    providers: [_angular_cdk_collections.UNIQUE_SELECTION_DISPATCHER_PROVIDER],
                },] },
    ];
    /** @nocollapse */
    CdkAccordionModule.ctorParameters = function () { return []; };
    return CdkAccordionModule;
}());

exports.CdkAccordionItem = CdkAccordionItem;
exports.CdkAccordion = CdkAccordion;
exports.CdkAccordionModule = CdkAccordionModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=cdk-accordion.umd.js.map
