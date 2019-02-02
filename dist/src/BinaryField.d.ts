/**
 * @module Content
 */ /** */
import { Observable } from 'rxjs/Observable';
import { MediaResourceObject } from './ComplexTypes';
import { IContent, SavedContent } from './Content';
import { BinaryFieldSetting } from './FieldSettings';
import { UploadProgressInfo } from './Repository/UploadModels';
/**
 * Represents a binary field instance
 */
export declare class BinaryField<T extends IContent> {
    private readonly _mediaResourceObject;
    private readonly _contentReference;
    private readonly _fieldSettings;
    /**
     * Saves a File object instance (from a form input or drop event) into the binary field
     * @param {File} file The file to be saved
     * @returns {Observable<UploadProgressInfo<T>>} An observable that will update with the upload progress
     */
    SaveBinaryFile: (file: File) => Observable<UploadProgressInfo<T>>;
    /**
     * Saves a text from a string variable into the Binary field
     * @param {string} text The text to be saved
     * @returns {Observable<UploadProgressInfo<T>>} An observable that will update with the upload progress
     */
    SaveBinaryText: (text: string) => Observable<UploadProgressInfo<T>>;
    /**
     * Returns the download URL for the binary
     */
    GetDownloadUrl(): string;
    /**
     * returns the MediaResourceObject from the binary field
     */
    GetMediaResourceObject(): MediaResourceObject;
    /**
     *
     * @param {MediaResourceObject} _mediaResourceObject The media resource object from the content response
     * @param {T} _contentReference The owner content reference
     * @param {BinaryFieldSetting} _fieldSettings The corresponding fieldsettings
     */
    constructor(_mediaResourceObject: MediaResourceObject, _contentReference: SavedContent<T>, _fieldSettings: BinaryFieldSetting);
}
