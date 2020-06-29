"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateToV10 = exports.updateToV9 = exports.updateToV8 = exports.updateToV7 = exports.updateToV6 = void 0;
const target_version_1 = require("../update-tool/target-version");
const upgrade_data_1 = require("./upgrade-data");
const devkit_migration_rule_1 = require("./devkit-migration-rule");
/** Entry point for the migration schematics with target of Angular CDK 6.0.0 */
function updateToV6() {
    return devkit_migration_rule_1.createMigrationSchematicRule(target_version_1.TargetVersion.V6, [], upgrade_data_1.cdkUpgradeData, onMigrationComplete);
}
exports.updateToV6 = updateToV6;
/** Entry point for the migration schematics with target of Angular CDK 7.0.0 */
function updateToV7() {
    return devkit_migration_rule_1.createMigrationSchematicRule(target_version_1.TargetVersion.V7, [], upgrade_data_1.cdkUpgradeData, onMigrationComplete);
}
exports.updateToV7 = updateToV7;
/** Entry point for the migration schematics with target of Angular CDK 8.0.0 */
function updateToV8() {
    return devkit_migration_rule_1.createMigrationSchematicRule(target_version_1.TargetVersion.V8, [], upgrade_data_1.cdkUpgradeData, onMigrationComplete);
}
exports.updateToV8 = updateToV8;
/** Entry point for the migration schematics with target of Angular CDK 9.0.0 */
function updateToV9() {
    return devkit_migration_rule_1.createMigrationSchematicRule(target_version_1.TargetVersion.V9, [], upgrade_data_1.cdkUpgradeData, onMigrationComplete);
}
exports.updateToV9 = updateToV9;
/** Entry point for the migration schematics with target of Angular CDK 10.0.0 */
function updateToV10() {
    return devkit_migration_rule_1.createMigrationSchematicRule(target_version_1.TargetVersion.V10, [], upgrade_data_1.cdkUpgradeData, onMigrationComplete);
}
exports.updateToV10 = updateToV10;
/** Function that will be called when the migration completed. */
function onMigrationComplete(context, targetVersion, hasFailures) {
    context.logger.info('');
    context.logger.info(`  ✓  Updated Angular CDK to ${targetVersion}`);
    context.logger.info('');
    if (hasFailures) {
        context.logger.warn('  ⚠  Some issues were detected but could not be fixed automatically. Please check the ' +
            'output above and fix these issues manually.');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3NjaGVtYXRpY3MvbmctdXBkYXRlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUdILGtFQUE0RDtBQUM1RCxpREFBOEM7QUFDOUMsbUVBQXFFO0FBRXJFLGdGQUFnRjtBQUNoRixTQUFnQixVQUFVO0lBQ3hCLE9BQU8sb0RBQTRCLENBQUMsOEJBQWEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLDZCQUFjLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUNqRyxDQUFDO0FBRkQsZ0NBRUM7QUFFRCxnRkFBZ0Y7QUFDaEYsU0FBZ0IsVUFBVTtJQUN4QixPQUFPLG9EQUE0QixDQUFDLDhCQUFhLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSw2QkFBYyxFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFDakcsQ0FBQztBQUZELGdDQUVDO0FBRUQsZ0ZBQWdGO0FBQ2hGLFNBQWdCLFVBQVU7SUFDeEIsT0FBTyxvREFBNEIsQ0FBQyw4QkFBYSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsNkJBQWMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2pHLENBQUM7QUFGRCxnQ0FFQztBQUVELGdGQUFnRjtBQUNoRixTQUFnQixVQUFVO0lBQ3hCLE9BQU8sb0RBQTRCLENBQUMsOEJBQWEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLDZCQUFjLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUNqRyxDQUFDO0FBRkQsZ0NBRUM7QUFFRCxpRkFBaUY7QUFDakYsU0FBZ0IsV0FBVztJQUN6QixPQUFPLG9EQUE0QixDQUFDLDhCQUFhLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSw2QkFBYyxFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFDbEcsQ0FBQztBQUZELGtDQUVDO0FBRUQsaUVBQWlFO0FBQ2pFLFNBQVMsbUJBQW1CLENBQUMsT0FBeUIsRUFBRSxhQUE0QixFQUN2RCxXQUFvQjtJQUMvQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN4QixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQywrQkFBK0IsYUFBYSxFQUFFLENBQUMsQ0FBQztJQUNwRSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUV4QixJQUFJLFdBQVcsRUFBRTtRQUNmLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUNmLHdGQUF3RjtZQUN4Riw2Q0FBNkMsQ0FBQyxDQUFDO0tBQ3BEO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1J1bGUsIFNjaGVtYXRpY0NvbnRleHR9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7VGFyZ2V0VmVyc2lvbn0gZnJvbSAnLi4vdXBkYXRlLXRvb2wvdGFyZ2V0LXZlcnNpb24nO1xuaW1wb3J0IHtjZGtVcGdyYWRlRGF0YX0gZnJvbSAnLi91cGdyYWRlLWRhdGEnO1xuaW1wb3J0IHtjcmVhdGVNaWdyYXRpb25TY2hlbWF0aWNSdWxlfSBmcm9tICcuL2RldmtpdC1taWdyYXRpb24tcnVsZSc7XG5cbi8qKiBFbnRyeSBwb2ludCBmb3IgdGhlIG1pZ3JhdGlvbiBzY2hlbWF0aWNzIHdpdGggdGFyZ2V0IG9mIEFuZ3VsYXIgQ0RLIDYuMC4wICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVG9WNigpOiBSdWxlIHtcbiAgcmV0dXJuIGNyZWF0ZU1pZ3JhdGlvblNjaGVtYXRpY1J1bGUoVGFyZ2V0VmVyc2lvbi5WNiwgW10sIGNka1VwZ3JhZGVEYXRhLCBvbk1pZ3JhdGlvbkNvbXBsZXRlKTtcbn1cblxuLyoqIEVudHJ5IHBvaW50IGZvciB0aGUgbWlncmF0aW9uIHNjaGVtYXRpY3Mgd2l0aCB0YXJnZXQgb2YgQW5ndWxhciBDREsgNy4wLjAgKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUb1Y3KCk6IFJ1bGUge1xuICByZXR1cm4gY3JlYXRlTWlncmF0aW9uU2NoZW1hdGljUnVsZShUYXJnZXRWZXJzaW9uLlY3LCBbXSwgY2RrVXBncmFkZURhdGEsIG9uTWlncmF0aW9uQ29tcGxldGUpO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIENESyA4LjAuMCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvVjgoKTogUnVsZSB7XG4gIHJldHVybiBjcmVhdGVNaWdyYXRpb25TY2hlbWF0aWNSdWxlKFRhcmdldFZlcnNpb24uVjgsIFtdLCBjZGtVcGdyYWRlRGF0YSwgb25NaWdyYXRpb25Db21wbGV0ZSk7XG59XG5cbi8qKiBFbnRyeSBwb2ludCBmb3IgdGhlIG1pZ3JhdGlvbiBzY2hlbWF0aWNzIHdpdGggdGFyZ2V0IG9mIEFuZ3VsYXIgQ0RLIDkuMC4wICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVG9WOSgpOiBSdWxlIHtcbiAgcmV0dXJuIGNyZWF0ZU1pZ3JhdGlvblNjaGVtYXRpY1J1bGUoVGFyZ2V0VmVyc2lvbi5WOSwgW10sIGNka1VwZ3JhZGVEYXRhLCBvbk1pZ3JhdGlvbkNvbXBsZXRlKTtcbn1cblxuLyoqIEVudHJ5IHBvaW50IGZvciB0aGUgbWlncmF0aW9uIHNjaGVtYXRpY3Mgd2l0aCB0YXJnZXQgb2YgQW5ndWxhciBDREsgMTAuMC4wICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVG9WMTAoKTogUnVsZSB7XG4gIHJldHVybiBjcmVhdGVNaWdyYXRpb25TY2hlbWF0aWNSdWxlKFRhcmdldFZlcnNpb24uVjEwLCBbXSwgY2RrVXBncmFkZURhdGEsIG9uTWlncmF0aW9uQ29tcGxldGUpO1xufVxuXG4vKiogRnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSBtaWdyYXRpb24gY29tcGxldGVkLiAqL1xuZnVuY3Rpb24gb25NaWdyYXRpb25Db21wbGV0ZShjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0LCB0YXJnZXRWZXJzaW9uOiBUYXJnZXRWZXJzaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNGYWlsdXJlczogYm9vbGVhbikge1xuICBjb250ZXh0LmxvZ2dlci5pbmZvKCcnKTtcbiAgY29udGV4dC5sb2dnZXIuaW5mbyhgICDinJMgIFVwZGF0ZWQgQW5ndWxhciBDREsgdG8gJHt0YXJnZXRWZXJzaW9ufWApO1xuICBjb250ZXh0LmxvZ2dlci5pbmZvKCcnKTtcblxuICBpZiAoaGFzRmFpbHVyZXMpIHtcbiAgICBjb250ZXh0LmxvZ2dlci53YXJuKFxuICAgICAgICAnICDimqAgIFNvbWUgaXNzdWVzIHdlcmUgZGV0ZWN0ZWQgYnV0IGNvdWxkIG5vdCBiZSBmaXhlZCBhdXRvbWF0aWNhbGx5LiBQbGVhc2UgY2hlY2sgdGhlICcgK1xuICAgICAgICAnb3V0cHV0IGFib3ZlIGFuZCBmaXggdGhlc2UgaXNzdWVzIG1hbnVhbGx5LicpO1xuICB9XG59XG4iXX0=