/**
 * @module Security
 * @preferred
 * @description    Module for security related stuff
 */ /** */
/**
 * Provides metadata about identity kind.
 */
export declare enum IdentityKind {
    All = 0,
    Users = 1,
    Groups = 2,
    OrganizationalUnits = 3,
    UsersAndGroups = 4,
    UsersAndOrganizationalUnits = 5,
    GroupsAndOrganizationalUnits = 6,
}
/**
 * Provides metadata about permission level.
 */
export declare enum PermissionLevel {
    AllowedOrDenied = 0,
    Allowed = 1,
    Denied = 2,
}
/**
 * Type to provide an Object with the permission information that has to be set.
 */
export declare class PermissionRequestBody {
    identity: string;
    localOnly?: boolean;
    RestrictedPreview?: PermissionValues;
    PreviewWithoutWatermakr?: PermissionValues;
    PreviewWithoutRedaction?: PermissionValues;
    Open?: PermissionValues;
    OpenMinor?: PermissionValues;
    Save?: PermissionValues;
    Publish?: PermissionValues;
    ForceUndoCheckout?: PermissionValues;
    AddNew?: PermissionValues;
    Approve?: PermissionValues;
    Delete?: PermissionValues;
    RecallOldVersion?: PermissionValues;
    DeleteOldVersion?: PermissionValues;
    SeePermissions?: PermissionValues;
    SetPermissions?: PermissionValues;
    RunApplication?: PermissionValues;
    ManageListsAndWorkspaces?: PermissionValues;
    TakeOwnership?: PermissionValues;
    Custom01?: PermissionValues;
    Custom02?: PermissionValues;
    Custom03?: PermissionValues;
    Custom04?: PermissionValues;
    Custom05?: PermissionValues;
    Custom06?: PermissionValues;
    Custom07?: PermissionValues;
    Custom08?: PermissionValues;
    Custom09?: PermissionValues;
    Custom10?: PermissionValues;
    Custom11?: PermissionValues;
    Custom12?: PermissionValues;
    Custom13?: PermissionValues;
    Custom14?: PermissionValues;
}
/**
 * Provides metadata about permission values.
 */
export declare enum PermissionValues {
    undefined = 0,
    allow = 1,
    deny = 2,
}
/**
 * Provides metadata about permission inheritance.
 */
export declare enum Inheritance {
    'break' = 0,
    'unbreak' = 1,
}
