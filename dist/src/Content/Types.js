"use strict";
/**
 * @module Content
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
/**
 * Typeguard that determines if the specified Object is a DeferredObject
 * @param fieldObject The object that needs to be checked
 */
exports.isDeferred = (fieldObject) => {
    return fieldObject && fieldObject.__deferred && fieldObject.__deferred.uri && fieldObject.__deferred.uri.length > 0 || false;
};
/**
 * Typeguard that determines if the specified Object is an IContentOptions instance
 * @param object The object that needs to be checked
 */
exports.isIContent = (object) => {
    return object && object.Id && object.Path && object.Type && object.Type.length > 0 || false;
};
/**
 * Typeguard that determines if the specified Object is a Content instance
 * @param object The object that needs to be checked
 */
exports.isContent = (object) => {
    return object instanceof index_1.ContentInternal;
};
/**
 * Typeguard that determines if the specified Object is an IContentOptions array
 * @param {any[]} objectList The object that needs to be checked
 */
exports.isIContentList = (objectList) => {
    return objectList && objectList.length !== undefined && objectList.find((o) => !exports.isIContent(o)) === undefined || false;
};
/**
 * Typeguard that determines if the specified Content instance is saved.
 * @param { ContentInternal<T> } c The content that needs to be checked
 */
exports.isSavedContent = (c) => {
    return c && exports.isContent(c) && c.Id && c.Path && c.Path.length && c.Name && c.Name.length > 0 || false;
};
//# sourceMappingURL=Types.js.map