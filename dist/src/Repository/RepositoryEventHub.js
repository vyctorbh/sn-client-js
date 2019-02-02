"use strict";
/**
 * @module Repository
 */
/** */
Object.defineProperty(exports, "__esModule", { value: true });
const Subject_1 = require("rxjs/Subject");
// tslint:disable-next-line:no-namespace
var EventModels;
(function (EventModels) {
    class Created {
    }
    EventModels.Created = Created;
    class CreateFailed {
    }
    EventModels.CreateFailed = CreateFailed;
    class Modified {
    }
    EventModels.Modified = Modified;
    class ModificationFailed {
    }
    EventModels.ModificationFailed = ModificationFailed;
    class Loaded {
    }
    EventModels.Loaded = Loaded;
    class Deleted {
    }
    EventModels.Deleted = Deleted;
    class DeleteFailed {
    }
    EventModels.DeleteFailed = DeleteFailed;
    class CustomActionExecuted {
    }
    EventModels.CustomActionExecuted = CustomActionExecuted;
    class CustomActionFailed {
    }
    EventModels.CustomActionFailed = CustomActionFailed;
    class ContentMoved {
    }
    EventModels.ContentMoved = ContentMoved;
    class ContentMoveFailed {
    }
    EventModels.ContentMoveFailed = ContentMoveFailed;
})(EventModels = exports.EventModels || (exports.EventModels = {}));
class RepositoryEventHub {
    constructor() {
        this._onContentCreatedSubject = new Subject_1.Subject();
        this._onContentCreateFailedSubject = new Subject_1.Subject();
        this._onContentModifiedSubject = new Subject_1.Subject();
        this._onContentModificationFailedSubject = new Subject_1.Subject();
        this._onContentLoadedSubject = new Subject_1.Subject();
        this._onContentDeletedSubject = new Subject_1.Subject();
        this._onContentDeleteFailedSubject = new Subject_1.Subject();
        this._onCustomActionExecutedSubject = new Subject_1.Subject();
        this._onCustomActionFailedSubject = new Subject_1.Subject();
        this._onContentMovedSubject = new Subject_1.Subject();
        this._onContentMoveFailedSubject = new Subject_1.Subject();
        this._onUploadProgressSubject = new Subject_1.Subject();
        /**
         * Method group for triggering Repository events
         */
        this.Trigger = {
            ContentCreated: (ev) => this._onContentCreatedSubject.next(ev),
            ContentCreateFailed: (ev) => this._onContentCreateFailedSubject.next(ev),
            ContentModified: (ev) => this._onContentModifiedSubject.next(ev),
            ContentModificationFailed: (ev) => this._onContentModificationFailedSubject.next(ev),
            ContentLoaded: (ev) => this._onContentLoadedSubject.next(ev),
            ContentDeleted: (ev) => this._onContentDeletedSubject.next(ev),
            ContentDeleteFailed: (ev) => this._onContentDeleteFailedSubject.next(ev),
            CustomActionExecuted: (ev) => this._onCustomActionExecutedSubject.next(ev),
            CustomActionFailed: (ev) => this._onCustomActionFailedSubject.next(ev),
            ContentMoved: (ev) => this._onContentMovedSubject.next(ev),
            ContentMoveFailed: (ev) => this._onContentMoveFailedSubject.next(ev),
            UploadProgress: (ev) => this._onUploadProgressSubject.next(ev)
        };
        /**
         * Triggered after a succesful Content creation
         */
        this.OnContentCreated = this._onContentCreatedSubject.asObservable();
        /**
         * Triggered after Content creation has been failed
         */
        this.OnContentCreateFailed = this._onContentCreateFailedSubject.asObservable();
        /**
         * Triggered after modifying a Content
         */
        this.OnContentModified = this._onContentModifiedSubject.asObservable();
        /**
         * Triggered when failed to modify a Content
         */
        this.OnContentModificationFailed = this._onContentModificationFailedSubject.asObservable();
        /**
         * Triggered when a Content is loaded from the Repository
         */
        this.OnContentLoaded = this._onContentLoadedSubject.asObservable();
        /**
         * Triggered after deleting a Content
         */
        this.OnContentDeleted = this._onContentDeletedSubject.asObservable();
        /**
         * Triggered after deleting a content has been failed
         */
        this.OnContentDeleteFailed = this._onContentDeleteFailedSubject.asObservable();
        /**
         * Triggered after moving a content to another location
         */
        this.OnContentMoved = this._onContentMovedSubject.asObservable();
        /**
         * Triggered after moving a content has been failed
         */
        this.OnContentMoveFailed = this._onContentMoveFailedSubject.asObservable();
        /**
         * Triggered after a custom OData Action has been executed
         */
        this.OnCustomActionExecuted = this._onCustomActionExecutedSubject.asObservable();
        /**
         * Triggered after a custom OData Action has been failed
         */
        this.OnCustomActionFailed = this._onCustomActionFailedSubject.asObservable();
        /**
         * Triggered on Upload progress
         */
        this.OnUploadProgress = this._onUploadProgressSubject.asObservable();
    }
}
exports.RepositoryEventHub = RepositoryEventHub;
//# sourceMappingURL=RepositoryEventHub.js.map