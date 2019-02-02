/**
 *
 * @module ContentTypes
 * @preferred
 *
 *
 * @description The Content Repository contains many different types of ```Content```. ```Content``` vary in structure and even in function. Different types of content contain different fields,
 * are displayed with different views, and may also implement different business logic. The fields, views and business logic of a content is defined by its type - the Content Type.
 *
 * Content Types are defined in a type hierarchy: a Content Type may be inherited from another Content Type - thus automatically inheriting its fields.
 *
 * This module represents the above mentioned type hierarchy by Typescript classes with the Content Types' Fields as properties. With Typescript classes we can derive types from another
 * inheriting its properties just like Content Types in the Content Repository. This module provides us to create an objects with a type so that we can validate on its properties by their
 * types or check the required ones.
 *
 */ /** */
import { BinaryField } from './BinaryField';
import { ContentListReferenceField, ContentReferenceField } from './ContentReferences';
import { ComplexTypes, Enums } from './SN';
/**
 * Class representing a ContentType
 * @class ContentType
 */
export declare class ContentType {
    Id?: number;
    ParentId?: number;
    VersionId?: number;
    Name?: string;
    CreatedById?: number;
    ModifiedById?: number;
    Version?: string;
    Path?: string;
    Depth?: number;
    IsSystemContent?: boolean;
    HandlerName?: string;
    ParentTypeName?: string;
    DisplayName?: string;
    Description?: string;
    Icon?: string;
    Binary?: ComplexTypes.MediaResourceObject;
    CreatedBy?: ContentReferenceField<GenericContent>;
    CreationDate?: string;
    ModifiedBy?: ContentReferenceField<GenericContent>;
    ModificationDate?: string;
    EnableLifespan?: boolean;
}
/**
 * Class representing a GenericContent
 * @class GenericContent
 */
export declare class GenericContent {
    Id?: number;
    ParentId?: number;
    OwnerId?: number;
    Owner?: ContentReferenceField<GenericContent>;
    VersionId?: number;
    Icon?: string;
    Name?: string;
    CreatedById?: number;
    ModifiedById?: number;
    Version?: string;
    Path?: string;
    Depth?: number;
    IsSystemContent?: boolean;
    IsFolder?: boolean;
    DisplayName?: string;
    Description?: string;
    Hidden?: boolean;
    Index?: number;
    EnableLifespan?: boolean;
    ValidFrom?: string;
    ValidTill?: string;
    AllowedChildTypes?: string;
    EffectiveAllowedChildTypes?: string;
    VersioningMode?: Enums.VersioningMode;
    InheritableVersioningMode?: Enums.InheritableVersioningMode;
    CreatedBy?: ContentReferenceField<GenericContent>;
    CreationDate?: string;
    ModifiedBy?: ContentReferenceField<GenericContent>;
    ModificationDate?: string;
    ApprovingMode?: Enums.ApprovingMode;
    InheritableApprovingMode?: Enums.InheritableApprovingMode;
    Locked?: boolean;
    CheckedOutTo?: ContentReferenceField<GenericContent>;
    TrashDisabled?: boolean;
    SavingState?: Enums.SavingState;
    ExtensionData?: string;
    BrowseApplication?: ContentReferenceField<GenericContent>;
    Approvable?: boolean;
    IsTaggable?: boolean;
    Tags?: string;
    IsRateable?: boolean;
    RateStr?: string;
    RateAvg?: number;
    RateCount?: number;
    Rate?: string;
    Publishable?: boolean;
    Versions?: ContentListReferenceField<GenericContent>;
    CheckInComments?: string;
    RejectReason?: string;
    Workspace?: ContentReferenceField<Workspace>;
    BrowseUrl?: string;
    Type?: string;
}
/**
 * Class representing a ContentLink
 * @class ContentLink
 * @extends {@link GenericContent}
 */
export declare class ContentLink extends GenericContent {
    Link?: ContentReferenceField<GenericContent>;
}
/**
 * Class representing a File
 * @class File
 * @extends {@link GenericContent}
 */
export declare class File extends GenericContent {
    Binary: BinaryField<this>;
    Size?: number;
    FullSize?: number;
    PageCount?: number;
    MimeType?: string;
    Shapes?: string;
    PageAttributes?: string;
    Watermark?: string;
}
/**
 * Class representing a DynamicJsonContent
 * @class DynamicJsonContent
 * @extends {@link File}
 */
export declare class DynamicJsonContent extends File {
}
/**
 * Class representing a ExecutableFile
 * @class ExecutableFile
 * @extends {@link File}
 */
export declare class ExecutableFile extends File {
}
/**
 * Class representing a HtmlTemplate
 * @class HtmlTemplate
 * @extends {@link File}
 */
export declare class HtmlTemplate extends File {
    TemplateText?: string;
}
/**
 * Class representing a Image
 * @class Image
 * @extends {@link File}
 */
export declare class Image extends File {
    Keywords?: string;
    DateTaken?: string;
    Width?: number;
    Height?: number;
}
/**
 * Class representing a PreviewImage
 * @class PreviewImage
 * @extends {@link Image}
 */
export declare class PreviewImage extends Image {
}
/**
 * Class representing a Settings
 * @class Settings
 * @extends {@link File}
 */
export declare class Settings extends File {
    GlobalOnly?: boolean;
}
/**
 * Class representing a IndexingSettings
 * @class IndexingSettings
 * @extends {@link Settings}
 */
export declare class IndexingSettings extends Settings {
    TextExtractorInstances?: string;
}
/**
 * Class representing a LoggingSettings
 * @class LoggingSettings
 * @extends {@link Settings}
 */
export declare class LoggingSettings extends Settings {
}
/**
 * Class representing a PortalSettings
 * @class PortalSettings
 * @extends {@link Settings}
 */
export declare class PortalSettings extends Settings {
}
/**
 * Class representing a SystemFile
 * @class SystemFile
 * @extends {@link File}
 */
export declare class SystemFile extends File {
}
/**
 * Class representing a Resource
 * @class Resource
 * @extends {@link SystemFile}
 */
export declare class Resource extends SystemFile {
    Downloads?: number;
}
/**
 * Class representing a Folder
 * @class Folder
 * @extends {@link GenericContent}
 */
export declare class Folder extends GenericContent {
}
/**
 * Class representing a ContentList
 * @class ContentList
 * @extends {@link Folder}
 */
export declare class ContentList extends Folder {
    ContentListDefinition?: string;
    DefaultView?: string;
    ListEmail?: string;
    ExchangeSubscriptionId?: string;
    OverwriteFiles?: boolean;
    GroupAttachments?: Enums.GroupAttachments;
    SaveOriginalEmail?: boolean;
    IncomingEmailWorkflow?: ContentReferenceField<GenericContent>;
    OnlyFromLocalGroups?: boolean;
    InboxFolder?: string;
    OwnerWhenVisitor?: ContentReferenceField<User>;
}
/**
 * Class representing a Aspect
 * @class Aspect
 * @extends {@link ContentList}
 */
export declare class Aspect extends ContentList {
    AspectDefinition?: string;
}
/**
 * Class representing a ItemList
 * @class ItemList
 * @extends {@link ContentList}
 */
export declare class ItemList extends ContentList {
}
/**
 * Class representing a CustomList
 * @class CustomList
 * @extends {@link ItemList}
 */
export declare class CustomList extends ItemList {
}
/**
 * Class representing a MemoList
 * @class MemoList
 * @extends {@link ItemList}
 */
export declare class MemoList extends ItemList {
}
/**
 * Class representing a TaskList
 * @class TaskList
 * @extends {@link ItemList}
 */
export declare class TaskList extends ItemList {
}
/**
 * Class representing a Library
 * @class Library
 * @extends {@link ContentList}
 */
export declare class Library extends ContentList {
}
/**
 * Class representing a DocumentLibrary
 * @class DocumentLibrary
 * @extends {@link Library}
 */
export declare class DocumentLibrary extends Library {
}
/**
 * Class representing a ImageLibrary
 * @class ImageLibrary
 * @extends {@link Library}
 */
export declare class ImageLibrary extends Library {
    CoverImage?: ContentReferenceField<Image>;
}
/**
 * Class representing a Device
 * @class Device
 * @extends {@link Folder}
 */
export declare class Device extends Folder {
    UserAgentPattern?: string;
}
/**
 * Class representing a Domain
 * @class Domain
 * @extends {@link Folder}
 */
export declare class Domain extends Folder {
    SyncGuid?: string;
    LastSync?: string;
}
/**
 * Class representing a Domains
 * @class Domains
 * @extends {@link Folder}
 */
export declare class Domains extends Folder {
}
/**
 * Class representing a Email
 * @class Email
 * @extends {@link Folder}
 */
export declare class Email extends Folder {
    From?: string;
    Body?: string;
    Sent?: string;
}
/**
 * Class representing a OrganizationalUnit
 * @class OrganizationalUnit
 * @extends {@link Folder}
 */
export declare class OrganizationalUnit extends Folder {
    SyncGuid?: string;
    LastSync?: string;
}
/**
 * Class representing a PortalRoot
 * @class PortalRoot
 * @extends {@link Folder}
 */
export declare class PortalRoot extends Folder {
}
/**
 * Class representing a ProfileDomain
 * @class ProfileDomain
 * @extends {@link Folder}
 */
export declare class ProfileDomain extends Folder {
}
/**
 * Class representing a Profiles
 * @class Profiles
 * @extends {@link Folder}
 */
export declare class Profiles extends Folder {
}
/**
 * Class representing a RuntimeContentContainer
 * @class RuntimeContentContainer
 * @extends {@link Folder}
 */
export declare class RuntimeContentContainer extends Folder {
}
/**
 * Class representing a Sites
 * @class Sites
 * @extends {@link Folder}
 */
export declare class Sites extends Folder {
}
/**
 * Class representing a SmartFolder
 * @class SmartFolder
 * @extends {@link Folder}
 */
export declare class SmartFolder extends Folder {
    Query?: string;
    EnableAutofilters?: Enums.EnableAutofilters;
    EnableLifespanFilter?: Enums.EnableLifespanFilter;
}
/**
 * Class representing a SystemFolder
 * @class SystemFolder
 * @extends {@link Folder}
 */
export declare class SystemFolder extends Folder {
}
/**
 * Class representing a Resources
 * @class Resources
 * @extends {@link SystemFolder}
 */
export declare class Resources extends SystemFolder {
}
/**
 * Class representing a TrashBag
 * @class TrashBag
 * @extends {@link Folder}
 */
export declare class TrashBag extends Folder {
    KeepUntil?: string;
    OriginalPath?: string;
    WorkspaceRelativePath?: string;
    WorkspaceId?: number;
    DeletedContent?: ContentReferenceField<GenericContent>;
}
/**
 * Class representing a Workspace
 * @class Workspace
 * @extends {@link Folder}
 */
export declare class Workspace extends Folder {
    Manager?: ContentReferenceField<User>;
    Deadline?: string;
    IsActive?: boolean;
    IsCritical?: boolean;
    IsWallContainer?: boolean;
    IsFollowed?: boolean;
}
/**
 * Class representing a Site
 * @class Site
 * @extends {@link Workspace}
 */
export declare class Site extends Workspace {
    Language?: Enums.Language;
    EnableClientBasedCulture?: boolean;
    EnableUserBasedCulture?: boolean;
    UrlList?: string;
    StartPage?: ContentReferenceField<GenericContent>;
    LoginPage?: ContentReferenceField<GenericContent>;
    DenyCrossSiteAccess?: boolean;
}
/**
 * Class representing a TrashBin
 * @class TrashBin
 * @extends {@link Workspace}
 */
export declare class TrashBin extends Workspace {
    MinRetentionTime?: number;
    SizeQuota?: number;
    BagCapacity?: number;
}
/**
 * Class representing a UserProfile
 * @class UserProfile
 * @extends {@link Workspace}
 */
export declare class UserProfile extends Workspace {
    User?: ContentReferenceField<User>;
}
/**
 * Class representing a Group
 * @class Group
 * @extends {@link GenericContent}
 */
export declare class Group extends GenericContent {
    Members?: ContentListReferenceField<User | Group>;
    SyncGuid?: string;
    LastSync?: string;
}
/**
 * Class representing a ListItem
 * @class ListItem
 * @extends {@link GenericContent}
 */
export declare class ListItem extends GenericContent {
}
/**
 * Class representing a CustomListItem
 * @class CustomListItem
 * @extends {@link ListItem}
 */
export declare class CustomListItem extends ListItem {
    WorkflowsRunning?: boolean;
}
/**
 * Class representing a Memo
 * @class Memo
 * @extends {@link ListItem}
 */
export declare class Memo extends ListItem {
    Date?: string;
    MemoType?: Enums.MemoType;
    SeeAlso?: ContentListReferenceField<GenericContent>;
}
/**
 * Class representing a Task
 * @class Task
 * @extends {@link ListItem}
 */
export declare class Task extends ListItem {
    StartDate?: string;
    DueDate?: string;
    AssignedTo?: ContentListReferenceField<User>;
    Priority?: Enums.Priority;
    Status?: Enums.Status;
    TaskCompletion?: number;
    RemainingDays?: number;
    DueText?: string;
    DueCssClass?: string;
}
/**
 * Class representing a Query
 * @class Query
 * @extends {@link GenericContent}
 */
export declare class Query extends GenericContent {
    Query?: string;
    QueryType?: Enums.QueryType;
}
/**
 * Class representing a User
 * @class User
 * @extends {@link GenericContent}
 */
export declare class User extends GenericContent {
    LoginName?: string;
    JobTitle?: string;
    Enabled?: boolean;
    Domain?: string;
    Email?: string;
    FullName?: string;
    ImageRef?: ContentReferenceField<GenericContent>;
    ImageData?: ComplexTypes.MediaResourceObject;
    Avatar?: ComplexTypes.DeferredObject;
    Password?: string;
    SyncGuid?: string;
    LastSync?: string;
    Captcha?: string;
    Manager?: ContentReferenceField<User>;
    Department?: string;
    Languages?: string;
    Phone?: string;
    Gender?: Enums.Gender;
    MaritalStatus?: Enums.MaritalStatus;
    BirthDate?: string;
    Education?: string;
    TwitterAccount?: string;
    FacebookURL?: string;
    LinkedInURL?: string;
    Language?: Enums.Language;
    FollowedWorkspaces?: ContentListReferenceField<Workspace>;
    ProfilePath?: string;
}
