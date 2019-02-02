/**
 * @module ODataApi
 */ /** */
/**
 * Generic Class that represents a basic OData Response structure
 */
import { IContent, ISavedContent } from '../Content';
export declare class ODataCollectionResponse<T extends IContent> {
    d: {
        results: (T & ISavedContent)[];
        __count: number;
    };
}
