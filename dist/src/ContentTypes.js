"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class representing a ContentType
 * @class ContentType
 */
class ContentType {
}
exports.ContentType = ContentType;
/**
 * Class representing a GenericContent
 * @class GenericContent
 */
class GenericContent {
}
exports.GenericContent = GenericContent;
/**
 * Class representing a ContentLink
 * @class ContentLink
 * @extends {@link GenericContent}
 */
class ContentLink extends GenericContent {
}
exports.ContentLink = ContentLink;
/**
 * Class representing a File
 * @class File
 * @extends {@link GenericContent}
 */
class File extends GenericContent {
}
exports.File = File;
/**
 * Class representing a DynamicJsonContent
 * @class DynamicJsonContent
 * @extends {@link File}
 */
class DynamicJsonContent extends File {
}
exports.DynamicJsonContent = DynamicJsonContent;
/**
 * Class representing a ExecutableFile
 * @class ExecutableFile
 * @extends {@link File}
 */
class ExecutableFile extends File {
}
exports.ExecutableFile = ExecutableFile;
/**
 * Class representing a HtmlTemplate
 * @class HtmlTemplate
 * @extends {@link File}
 */
class HtmlTemplate extends File {
}
exports.HtmlTemplate = HtmlTemplate;
/**
 * Class representing a Image
 * @class Image
 * @extends {@link File}
 */
class Image extends File {
}
exports.Image = Image;
/**
 * Class representing a PreviewImage
 * @class PreviewImage
 * @extends {@link Image}
 */
class PreviewImage extends Image {
}
exports.PreviewImage = PreviewImage;
/**
 * Class representing a Settings
 * @class Settings
 * @extends {@link File}
 */
class Settings extends File {
}
exports.Settings = Settings;
/**
 * Class representing a IndexingSettings
 * @class IndexingSettings
 * @extends {@link Settings}
 */
class IndexingSettings extends Settings {
}
exports.IndexingSettings = IndexingSettings;
/**
 * Class representing a LoggingSettings
 * @class LoggingSettings
 * @extends {@link Settings}
 */
class LoggingSettings extends Settings {
}
exports.LoggingSettings = LoggingSettings;
/**
 * Class representing a PortalSettings
 * @class PortalSettings
 * @extends {@link Settings}
 */
class PortalSettings extends Settings {
}
exports.PortalSettings = PortalSettings;
/**
 * Class representing a SystemFile
 * @class SystemFile
 * @extends {@link File}
 */
class SystemFile extends File {
}
exports.SystemFile = SystemFile;
/**
 * Class representing a Resource
 * @class Resource
 * @extends {@link SystemFile}
 */
class Resource extends SystemFile {
}
exports.Resource = Resource;
/**
 * Class representing a Folder
 * @class Folder
 * @extends {@link GenericContent}
 */
class Folder extends GenericContent {
}
exports.Folder = Folder;
/**
 * Class representing a ContentList
 * @class ContentList
 * @extends {@link Folder}
 */
class ContentList extends Folder {
}
exports.ContentList = ContentList;
/**
 * Class representing a Aspect
 * @class Aspect
 * @extends {@link ContentList}
 */
class Aspect extends ContentList {
}
exports.Aspect = Aspect;
/**
 * Class representing a ItemList
 * @class ItemList
 * @extends {@link ContentList}
 */
class ItemList extends ContentList {
}
exports.ItemList = ItemList;
/**
 * Class representing a CustomList
 * @class CustomList
 * @extends {@link ItemList}
 */
class CustomList extends ItemList {
}
exports.CustomList = CustomList;
/**
 * Class representing a MemoList
 * @class MemoList
 * @extends {@link ItemList}
 */
class MemoList extends ItemList {
}
exports.MemoList = MemoList;
/**
 * Class representing a TaskList
 * @class TaskList
 * @extends {@link ItemList}
 */
class TaskList extends ItemList {
}
exports.TaskList = TaskList;
/**
 * Class representing a Library
 * @class Library
 * @extends {@link ContentList}
 */
class Library extends ContentList {
}
exports.Library = Library;
/**
 * Class representing a DocumentLibrary
 * @class DocumentLibrary
 * @extends {@link Library}
 */
class DocumentLibrary extends Library {
}
exports.DocumentLibrary = DocumentLibrary;
/**
 * Class representing a ImageLibrary
 * @class ImageLibrary
 * @extends {@link Library}
 */
class ImageLibrary extends Library {
}
exports.ImageLibrary = ImageLibrary;
/**
 * Class representing a Device
 * @class Device
 * @extends {@link Folder}
 */
class Device extends Folder {
}
exports.Device = Device;
/**
 * Class representing a Domain
 * @class Domain
 * @extends {@link Folder}
 */
class Domain extends Folder {
}
exports.Domain = Domain;
/**
 * Class representing a Domains
 * @class Domains
 * @extends {@link Folder}
 */
class Domains extends Folder {
}
exports.Domains = Domains;
/**
 * Class representing a Email
 * @class Email
 * @extends {@link Folder}
 */
class Email extends Folder {
}
exports.Email = Email;
/**
 * Class representing a OrganizationalUnit
 * @class OrganizationalUnit
 * @extends {@link Folder}
 */
class OrganizationalUnit extends Folder {
}
exports.OrganizationalUnit = OrganizationalUnit;
/**
 * Class representing a PortalRoot
 * @class PortalRoot
 * @extends {@link Folder}
 */
class PortalRoot extends Folder {
}
exports.PortalRoot = PortalRoot;
/**
 * Class representing a ProfileDomain
 * @class ProfileDomain
 * @extends {@link Folder}
 */
class ProfileDomain extends Folder {
}
exports.ProfileDomain = ProfileDomain;
/**
 * Class representing a Profiles
 * @class Profiles
 * @extends {@link Folder}
 */
class Profiles extends Folder {
}
exports.Profiles = Profiles;
/**
 * Class representing a RuntimeContentContainer
 * @class RuntimeContentContainer
 * @extends {@link Folder}
 */
class RuntimeContentContainer extends Folder {
}
exports.RuntimeContentContainer = RuntimeContentContainer;
/**
 * Class representing a Sites
 * @class Sites
 * @extends {@link Folder}
 */
class Sites extends Folder {
}
exports.Sites = Sites;
/**
 * Class representing a SmartFolder
 * @class SmartFolder
 * @extends {@link Folder}
 */
class SmartFolder extends Folder {
}
exports.SmartFolder = SmartFolder;
/**
 * Class representing a SystemFolder
 * @class SystemFolder
 * @extends {@link Folder}
 */
class SystemFolder extends Folder {
}
exports.SystemFolder = SystemFolder;
/**
 * Class representing a Resources
 * @class Resources
 * @extends {@link SystemFolder}
 */
class Resources extends SystemFolder {
}
exports.Resources = Resources;
/**
 * Class representing a TrashBag
 * @class TrashBag
 * @extends {@link Folder}
 */
class TrashBag extends Folder {
}
exports.TrashBag = TrashBag;
/**
 * Class representing a Workspace
 * @class Workspace
 * @extends {@link Folder}
 */
class Workspace extends Folder {
}
exports.Workspace = Workspace;
/**
 * Class representing a Site
 * @class Site
 * @extends {@link Workspace}
 */
class Site extends Workspace {
}
exports.Site = Site;
/**
 * Class representing a TrashBin
 * @class TrashBin
 * @extends {@link Workspace}
 */
class TrashBin extends Workspace {
}
exports.TrashBin = TrashBin;
/**
 * Class representing a UserProfile
 * @class UserProfile
 * @extends {@link Workspace}
 */
class UserProfile extends Workspace {
}
exports.UserProfile = UserProfile;
/**
 * Class representing a Group
 * @class Group
 * @extends {@link GenericContent}
 */
class Group extends GenericContent {
}
exports.Group = Group;
/**
 * Class representing a ListItem
 * @class ListItem
 * @extends {@link GenericContent}
 */
class ListItem extends GenericContent {
}
exports.ListItem = ListItem;
/**
 * Class representing a CustomListItem
 * @class CustomListItem
 * @extends {@link ListItem}
 */
class CustomListItem extends ListItem {
}
exports.CustomListItem = CustomListItem;
/**
 * Class representing a Memo
 * @class Memo
 * @extends {@link ListItem}
 */
class Memo extends ListItem {
}
exports.Memo = Memo;
/**
 * Class representing a Task
 * @class Task
 * @extends {@link ListItem}
 */
class Task extends ListItem {
}
exports.Task = Task;
/**
 * Class representing a Query
 * @class Query
 * @extends {@link GenericContent}
 */
class Query extends GenericContent {
}
exports.Query = Query;
/**
 * Class representing a User
 * @class User
 * @extends {@link GenericContent}
 */
class User extends GenericContent {
}
exports.User = User;
//# sourceMappingURL=ContentTypes.js.map