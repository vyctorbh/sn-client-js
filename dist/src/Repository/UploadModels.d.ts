/**
 * @module Content
 */ /** */
import { IContent, SavedContent } from '../Content';
import { IODataParams } from '../ODataApi/index';
export declare type WithParentContent<T> = T & {
    Parent: SavedContent;
};
export declare class UploadOptions<T extends IContent> {
    /**
     * The type of the content to upload, usually should be 'File'
     */
    ContentType: {
        new (...args: any[]): T;
    };
    /**
     * The property to save the Binary data to, usually 'Binary'
     */
    PropertyName: string;
    /**
     * Sets if the target content should be overwritten
     */
    Overwrite: boolean;
    /**
     * Additional options to post
     */
    Body?: any;
    /**
     *
     */
    OdataOptions?: IODataParams<T>;
}
export declare class UploadFileOptions<T extends IContent> extends UploadOptions<T> {
    /**
     * The File instance to be posted
     */
    File: File;
}
export declare class UploadTextOptions<T extends IContent> extends UploadOptions<T> {
    /**
     * The text data that will be saved to the binary field
     */
    Text: string;
    /**
     * The name of the file
     */
    FileName: string;
}
export declare class UploadFromEventOptions<T extends IContent> extends UploadOptions<T> {
    /**
     * The DragEvent to work with. File data will be extracted from it's 'dataTransfer' item.
     */
    Event: DragEvent;
    /**
     * Option if folders should be created as well.
     */
    CreateFolders: boolean;
}
export declare class UploadProgressInfo<T extends IContent> {
    /**
     * Basic info about the created Content
     */
    CreatedContent: SavedContent<T>;
    /**
     * Total chunks count
     */
    ChunkCount: number;
    /**
     * Uploaded chunks
     */
    UploadedChunks: number;
    /**
     * Flag that indicates if the upload has been completed
     */
    Completed: boolean;
}
export declare class SaveBinaryFileOptions {
    /**
     * The File to be saved
     */
    File: File;
}
export declare class UploadResponse {
    /**
     * The ID of the created Content
     */
    ContentId: number;
    /**
     * The Chunk token that can be used during upload
     */
    ChunkToken: string;
    /**
     * Flag that indicates if the Content should be finialized after upload
     */
    MustFinialize: boolean;
    /**
     * Flag that indicates if the Content should be checked in after upload
     */
    MustCheckin: boolean;
    constructor(...args: any[]);
}
