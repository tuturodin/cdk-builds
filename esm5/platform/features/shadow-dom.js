/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var shadowDomIsSupported;
/** Checks whether the user's browser support Shadow DOM. */
export function _supportsShadowDom() {
    if (shadowDomIsSupported == null) {
        var head = typeof document !== 'undefined' ? document.head : null;
        shadowDomIsSupported = !!(head && (head.createShadowRoot || head.attachShadow));
    }
    return shadowDomIsSupported;
}
/** Gets the shadow root of an element, if supported and the element is inside the Shadow DOM. */
export function _getShadowRoot(element) {
    if (_supportsShadowDom()) {
        var rootNode = element.getRootNode ? element.getRootNode() : null;
        if (rootNode instanceof ShadowRoot) {
            return rootNode;
        }
    }
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhZG93LWRvbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvcGxhdGZvcm0vZmVhdHVyZXMvc2hhZG93LWRvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxJQUFJLG9CQUE2QixDQUFDO0FBRWxDLDREQUE0RDtBQUM1RCxNQUFNLFVBQVUsa0JBQWtCO0lBQ2hDLElBQUksb0JBQW9CLElBQUksSUFBSSxFQUFFO1FBQ2hDLElBQU0sSUFBSSxHQUFHLE9BQU8sUUFBUSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3BFLG9CQUFvQixHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFFLElBQVksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztLQUMxRjtJQUVELE9BQU8sb0JBQW9CLENBQUM7QUFDOUIsQ0FBQztBQUVELGlHQUFpRztBQUNqRyxNQUFNLFVBQVUsY0FBYyxDQUFDLE9BQW9CO0lBQ2pELElBQUksa0JBQWtCLEVBQUUsRUFBRTtRQUN4QixJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUVwRSxJQUFJLFFBQVEsWUFBWSxVQUFVLEVBQUU7WUFDbEMsT0FBTyxRQUFRLENBQUM7U0FDakI7S0FDRjtJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5sZXQgc2hhZG93RG9tSXNTdXBwb3J0ZWQ6IGJvb2xlYW47XG5cbi8qKiBDaGVja3Mgd2hldGhlciB0aGUgdXNlcidzIGJyb3dzZXIgc3VwcG9ydCBTaGFkb3cgRE9NLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9zdXBwb3J0c1NoYWRvd0RvbSgpOiBib29sZWFuIHtcbiAgaWYgKHNoYWRvd0RvbUlzU3VwcG9ydGVkID09IG51bGwpIHtcbiAgICBjb25zdCBoZWFkID0gdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyA/IGRvY3VtZW50LmhlYWQgOiBudWxsO1xuICAgIHNoYWRvd0RvbUlzU3VwcG9ydGVkID0gISEoaGVhZCAmJiAoKGhlYWQgYXMgYW55KS5jcmVhdGVTaGFkb3dSb290IHx8IGhlYWQuYXR0YWNoU2hhZG93KSk7XG4gIH1cblxuICByZXR1cm4gc2hhZG93RG9tSXNTdXBwb3J0ZWQ7XG59XG5cbi8qKiBHZXRzIHRoZSBzaGFkb3cgcm9vdCBvZiBhbiBlbGVtZW50LCBpZiBzdXBwb3J0ZWQgYW5kIHRoZSBlbGVtZW50IGlzIGluc2lkZSB0aGUgU2hhZG93IERPTS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfZ2V0U2hhZG93Um9vdChlbGVtZW50OiBIVE1MRWxlbWVudCk6IE5vZGUgfCBudWxsIHtcbiAgaWYgKF9zdXBwb3J0c1NoYWRvd0RvbSgpKSB7XG4gICAgY29uc3Qgcm9vdE5vZGUgPSBlbGVtZW50LmdldFJvb3ROb2RlID8gZWxlbWVudC5nZXRSb290Tm9kZSgpIDogbnVsbDtcblxuICAgIGlmIChyb290Tm9kZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpIHtcbiAgICAgIHJldHVybiByb290Tm9kZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiJdfQ==