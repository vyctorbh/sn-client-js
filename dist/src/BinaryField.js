"use strict";
/**
 * @module Content
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents a binary field instance
 */
class BinaryField {
    /**
     *
     * @param {MediaResourceObject} _mediaResourceObject The media resource object from the content response
     * @param {T} _contentReference The owner content reference
     * @param {BinaryFieldSetting} _fieldSettings The corresponding fieldsettings
     */
    constructor(_mediaResourceObject, _contentReference, _fieldSettings) {
        this._mediaResourceObject = _mediaResourceObject;
        this._contentReference = _contentReference;
        this._fieldSettings = _fieldSettings;
        /**
         * Saves a File object instance (from a form input or drop event) into the binary field
         * @param {File} file The file to be saved
         * @returns {Observable<UploadProgressInfo<T>>} An observable that will update with the upload progress
         */
        this.SaveBinaryFile = (file) => this._contentReference.GetRepository().UploadFile({
            File: new File([file], this._contentReference.Name),
            Parent: { GetFullPath: () => this._contentReference.ParentContentPath, Path: this._contentReference.ParentPath },
            PropertyName: this._fieldSettings.Name,
            ContentType: this._contentReference.constructor,
            Overwrite: true,
        });
        /**
         * Saves a text from a string variable into the Binary field
         * @param {string} text The text to be saved
         * @returns {Observable<UploadProgressInfo<T>>} An observable that will update with the upload progress
         */
        this.SaveBinaryText = (text) => this.SaveBinaryFile(new File([text], this._contentReference.Name));
    }
    /**
     * Returns the download URL for the binary
     */
    GetDownloadUrl() {
        if (!this._mediaResourceObject || typeof this._mediaResourceObject !== 'object') {
            return `/binaryhandler.ashx?nodeid=${this._contentReference.Id}&propertyname=${this._fieldSettings.Name}`;
        }
        return this._mediaResourceObject.__mediaresource.media_src;
    }
    /**
     * returns the MediaResourceObject from the binary field
     */
    GetMediaResourceObject() {
        return Object.assign({}, this._mediaResourceObject);
    }
}
exports.BinaryField = BinaryField;
//# sourceMappingURL=BinaryField.js.map