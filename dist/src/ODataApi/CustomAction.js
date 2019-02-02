"use strict";
/**
 * @module ODataApi
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:naming-convention
/**
 * Class that represents a custom OData Action
 */
class CustomAction {
    constructor(options) {
        this.params = [];
        this.requiredParams = [];
        this.isAction = false;
        this.noCache = false;
        this.name = options.name;
        this.id = options.id;
        this.path = options.path;
        this.isAction = options.isAction || false;
        this.noCache = options.noCache || false;
        if (options.params) {
            this.params = this.params.concat(options.params);
        }
        if (options.requiredParams) {
            this.params = this.params.concat(options.requiredParams);
        }
    }
}
exports.CustomAction = CustomAction;
//# sourceMappingURL=CustomAction.js.map