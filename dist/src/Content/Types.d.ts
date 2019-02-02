/**
 * @module Content
 */ /** */
import { DeferredObject } from '../ComplexTypes';
import { IContent } from './IContent';
import { ContentInternal } from './index';
import { ISavedContent } from './ISavedContent';
/**
 * Generic type alias for a Content representation. It's possible that a content of this type has not been saved yet to the Repository.
 */
export declare type Content<T extends IContent = any> = ContentInternal<T> & T;
/**
 * Generic type alias for a saved Content representation. Saved contents *have* an Id, Path and a Name property
 */
export declare type SavedContent<T extends IContent = any> = ContentInternal<T> & T & ISavedContent;
/**
 * Typeguard that determines if the specified Object is a DeferredObject
 * @param fieldObject The object that needs to be checked
 */
export declare const isDeferred: (fieldObject: any) => fieldObject is DeferredObject;
/**
 * Typeguard that determines if the specified Object is an IContentOptions instance
 * @param object The object that needs to be checked
 */
export declare const isIContent: (object: any) => object is IContent;
/**
 * Typeguard that determines if the specified Object is a Content instance
 * @param object The object that needs to be checked
 */
export declare const isContent: <T extends IContent = IContent>(object: any) => object is ContentInternal<T>;
/**
 * Typeguard that determines if the specified Object is an IContentOptions array
 * @param {any[]} objectList The object that needs to be checked
 */
export declare const isIContentList: (objectList: any[]) => objectList is IContent[];
/**
 * Typeguard that determines if the specified Content instance is saved.
 * @param { ContentInternal<T> } c The content that needs to be checked
 */
export declare const isSavedContent: <T extends IContent>(c: ContentInternal<T>) => c is SavedContent<T>;
