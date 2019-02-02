/**
 * @module ContentSerializer
 * @preferred
 * @description Utility to serialize and deserialize Content instances.
 *
 */ /** */
import { IContent, SavedContent } from './Content';
/**
 * Represents a serialized Content instance wich can be stringified using JSON.stringify()
 */
export declare class SerializedContent<T extends IContent> {
    /**
     * The original content's field data
     */
    Data: T;
    /**
     * The full original Path for the original Content (e.g.: 'https://my.sensenet.com/OData.svc/Root/Temp/MyContent)
     */
    Origin: string;
}
export declare class ContentSerializer {
    /**
     * Creates a SerializedContent instance from a Content instance
     * @throws If the content Path is not provided and the Origin cannot be determined
     * @param {Content} content The Content that needs to be serialized
     * @returns {SerializedContent} the SerializedContent instance
     */
    static Serialize<T extends IContent>(content: SavedContent<T>): SerializedContent<T>;
    /**
     * Creates a stringified SerializedContent instance from a Content instance
     * @param content The Content instance that needs to be serialized
     * @returns {string} The Stringified content
     */
    static Stringify<T extends IContent>(content: SavedContent<T>): string;
    /**
     * Serializes a stringified SerializedContent string to a SerializedContent instance
     * @param contentString the stringified SerializedContent data
     */
    static Parse<T extends IContent>(contentString: string): SerializedContent<SavedContent<T>>;
}
