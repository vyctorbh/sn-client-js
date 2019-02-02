/**
 * @module ODataApi
 */ /** */
/**
 * Generic Class that represents a basic OData Response structure
 */
import { ISavedContent } from '../Content';
export declare class ODataResponse<T extends ISavedContent> {
    d: T;
}
