/**
 * @module ODataApi
 */ /** */
import { ISavedContent } from '../Content';
/**
 * Represents a Batch Operation response from Batch Copy/Move/Delete action
 */
export declare class ODataBatchResponse<T extends ISavedContent = ISavedContent> {
    d: {
        __count: number;
        results: T[];
        errors: {
            content: T;
            error: any;
        }[];
    };
}
