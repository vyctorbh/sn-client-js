/**
 * @module Repository
 */
/** */
import { Observable } from 'rxjs/Observable';
import { IContent, SavedContent } from '../Content';
import { ICustomActionOptions, IODataParams } from '../ODataApi';
import { UploadProgressInfo } from './UploadModels';
export declare namespace EventModels {
    class Created {
        /**
         * The created Content instance
         */
        Content: SavedContent;
    }
    class CreateFailed {
        /**
         * The unsaved Content instance
         */
        Content: IContent;
        /**
         * The Error that caused the failure
         */
        Error: any;
    }
    class Modified {
        /**
         * The Content instance that has been modified.
         */
        Content: SavedContent;
        /**
         * The original fields
         */
        OriginalFields: IContent;
        /**
         * The Change data
         */
        Changes: IContent;
    }
    class ModificationFailed {
        /**
         * The Content instance that has been failed to modify
         */
        Content: SavedContent;
        /**
         * The Fields that you've been tried to modify
         */
        Fields?: IContent;
        /**
         * The Error that caused the failure
         */
        Error: any;
    }
    class Loaded {
        /**
         * The Loaded content instance
         */
        Content: SavedContent;
    }
    class Deleted {
        /**
         * The Content data that has been deleted
         */
        ContentData: IContent;
        /**
         * Indicates if the Content was deleted permanently or just moved to Trash
         */
        Permanently: boolean;
    }
    class DeleteFailed {
        /**
         * The Content that you've tried to delete
         */
        Content: SavedContent;
        /**
         * Indicates if you've tried to delete the Content permanently or just tried to move it to the Trash
         */
        Permanently: boolean;
        /**
         * The Error that caused the failure
         */
        Error: any;
    }
    class CustomActionExecuted<T extends IContent> {
        /**
         * The Action options
         */
        ActionOptions: ICustomActionOptions;
        /**
         * The additional OData parameters (optional)
         */
        ODataParams?: IODataParams<T>;
        /**
         * The Action result
         */
        Result: any;
    }
    class CustomActionFailed<T extends IContent> {
        /**
         * The Action options
         */
        ActionOptions: ICustomActionOptions;
        /**
         * The additional OData parameters (optional)
         */
        ODataParams?: IODataParams<T>;
        /**
         * The Type of the Result object
         */
        ResultType: {
            new (...args: any[]): any;
        };
        /**
         * The Error that caused the failure
         */
        Error: any;
    }
    class ContentMoved {
        /**
         * The From path (the original Parent's Path)
         */
        From: string;
        /**
         * The destination path (the new Parent's Path)
         */
        To: string;
        /**
         * The moved Content instance
         */
        Content: SavedContent;
    }
    class ContentMoveFailed {
        /**
         * The From path (the original Parent's Path)
         */
        From: string;
        /**
         * The destination path (the new Parent's Path)
         */
        To: string;
        /**
         * The Content instance that you've tried to move
         */
        Content: SavedContent;
        /**
         * The Error that caused the failure
         */
        Error: any;
    }
}
export declare class RepositoryEventHub {
    private readonly _onContentCreatedSubject;
    private readonly _onContentCreateFailedSubject;
    private readonly _onContentModifiedSubject;
    private readonly _onContentModificationFailedSubject;
    private readonly _onContentLoadedSubject;
    private readonly _onContentDeletedSubject;
    private readonly _onContentDeleteFailedSubject;
    private readonly _onCustomActionExecutedSubject;
    private readonly _onCustomActionFailedSubject;
    private readonly _onContentMovedSubject;
    private readonly _onContentMoveFailedSubject;
    private readonly _onUploadProgressSubject;
    /**
     * Method group for triggering Repository events
     */
    Trigger: {
        ContentCreated: (ev: EventModels.Created) => void;
        ContentCreateFailed: (ev: EventModels.CreateFailed) => void;
        ContentModified: (ev: EventModels.Modified) => void;
        ContentModificationFailed: (ev: EventModels.ModificationFailed) => void;
        ContentLoaded: (ev: EventModels.Loaded) => void;
        ContentDeleted: (ev: EventModels.Deleted) => void;
        ContentDeleteFailed: (ev: EventModels.DeleteFailed) => void;
        CustomActionExecuted: (ev: EventModels.CustomActionExecuted<any>) => void;
        CustomActionFailed: (ev: EventModels.CustomActionFailed<any>) => void;
        ContentMoved: (ev: EventModels.ContentMoved) => void;
        ContentMoveFailed: (ev: EventModels.ContentMoveFailed) => void;
        UploadProgress: (ev: UploadProgressInfo<any>) => void;
    };
    /**
     * Triggered after a succesful Content creation
     */
    OnContentCreated: Observable<EventModels.Created>;
    /**
     * Triggered after Content creation has been failed
     */
    OnContentCreateFailed: Observable<EventModels.CreateFailed>;
    /**
     * Triggered after modifying a Content
     */
    OnContentModified: Observable<EventModels.Modified>;
    /**
     * Triggered when failed to modify a Content
     */
    OnContentModificationFailed: Observable<EventModels.ModificationFailed>;
    /**
     * Triggered when a Content is loaded from the Repository
     */
    OnContentLoaded: Observable<EventModels.Loaded>;
    /**
     * Triggered after deleting a Content
     */
    OnContentDeleted: Observable<EventModels.Deleted>;
    /**
     * Triggered after deleting a content has been failed
     */
    OnContentDeleteFailed: Observable<EventModels.DeleteFailed>;
    /**
     * Triggered after moving a content to another location
     */
    OnContentMoved: Observable<EventModels.ContentMoved>;
    /**
     * Triggered after moving a content has been failed
     */
    OnContentMoveFailed: Observable<EventModels.ContentMoveFailed>;
    /**
     * Triggered after a custom OData Action has been executed
     */
    OnCustomActionExecuted: Observable<EventModels.CustomActionExecuted<IContent>>;
    /**
     * Triggered after a custom OData Action has been failed
     */
    OnCustomActionFailed: Observable<EventModels.CustomActionFailed<IContent>>;
    /**
     * Triggered on Upload progress
     */
    OnUploadProgress: Observable<UploadProgressInfo<IContent>>;
}
