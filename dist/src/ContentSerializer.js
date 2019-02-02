"use strict";
/**
 * @module ContentSerializer
 * @preferred
 * @description Utility to serialize and deserialize Content instances.
 *
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
const SN_1 = require("./SN");
/**
 * Represents a serialized Content instance wich can be stringified using JSON.stringify()
 */
class SerializedContent {
}
exports.SerializedContent = SerializedContent;
class ContentSerializer {
    /**
     * Creates a SerializedContent instance from a Content instance
     * @throws If the content Path is not provided and the Origin cannot be determined
     * @param {Content} content The Content that needs to be serialized
     * @returns {SerializedContent} the SerializedContent instance
     */
    static Serialize(content) {
        const repoUrl = content.GetRepository().ODataBaseUrl;
        return {
            Data: content.GetFields(true),
            Origin: SN_1.ODataHelper.joinPaths(`${repoUrl}`, content.Path)
        };
    }
    /**
     * Creates a stringified SerializedContent instance from a Content instance
     * @param content The Content instance that needs to be serialized
     * @returns {string} The Stringified content
     */
    static Stringify(content) {
        return JSON.stringify(this.Serialize(content));
    }
    /**
     * Serializes a stringified SerializedContent string to a SerializedContent instance
     * @param contentString the stringified SerializedContent data
     */
    static Parse(contentString) {
        return JSON.parse(contentString);
    }
}
exports.ContentSerializer = ContentSerializer;
//# sourceMappingURL=ContentSerializer.js.map