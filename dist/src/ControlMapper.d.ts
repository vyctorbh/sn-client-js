/**
 *
 * @module ControlMapper
 *
 * @preferred
 *
 * @description Module for mapping controls content types and / or field settings to specified front-end controls
 *
 * ```
 * let controlMapper = new ControlMapper(MyBaseControlClass, myConfigFactory, DefaultViewComponent, DefaultFieldComponent)
 *       .SetupFieldSettingDefault(FieldSettings.ShortTextFieldSetting, (setting) => {
 *          switch (setting.Name) {
 *              case 'Name':
 *                  return NameField;
 *              case 'DisplayName':
 *                  return DisplayName;
 *              default:
 *                  break;
 *          }
 *          return ShortText;
 *       })
 *
 * ```
 */ /** */
import { IContent } from './Content';
import * as FieldSettings from './FieldSettings';
import { BaseRepository } from './Repository/index';
import { Schemas } from './SN';
export declare type ActionName = 'new' | 'edit' | 'view';
export declare class ControlSchema<TControlBaseType, TClientControlSettings> {
    ContentTypeControl: {
        new (...args: any[]): TControlBaseType;
    };
    Schema: Schemas.Schema;
    FieldMappings: {
        FieldSettings: FieldSettings.FieldSetting;
        ControlType: {
            new (...args: any[]): TControlBaseType;
        };
        ClientSettings: TClientControlSettings;
    }[];
}
export declare class ControlMapper<TControlBaseType, TClientControlSettings> {
    private readonly _repository;
    readonly ControlBaseType: {
        new (...args: any[]): TControlBaseType;
    };
    private readonly _clientControlSettingsFactory;
    private readonly _defaultControlType;
    private readonly _defaultFieldSettingControlType;
    constructor(_repository: BaseRepository, ControlBaseType: {
        new (...args: any[]): TControlBaseType;
    }, _clientControlSettingsFactory: (fieldSetting: FieldSettings.FieldSetting) => TClientControlSettings, _defaultControlType?: (new (...args: any[]) => TControlBaseType) | undefined, _defaultFieldSettingControlType?: (new (...args: any[]) => TControlBaseType) | undefined);
    /**
     * Method for getting a specified Schema object for a content type. The FieldSettings will be filtered based on the provided actionName.
     * @param contentType The type of the content (e.g. ContentTypes.Task)
     * @param actionName The name of the action. Can be 'new' / 'view' / 'edit'
     */
    private getTypeSchema<TContentType>(contentType, actionName);
    private _contentTypeControlMaps;
    /**
     * Maps a specified Control to a Content type
     * @param content The Content to be mapped
     * @param control The Control for the content
     * @returns {ControlMapper}
     */
    MapContentTypeToControl(contentType: {
        new (...args: any[]): IContent;
    }, control: {
        new (...args: any[]): TControlBaseType;
    }): this;
    /**
     *
     * @param content The content to get the control for.
     * @returns {TControlBaseType} The mapped control, Default if nothing is mapped.
     */
    GetControlForContentType<TContentType extends IContent>(contentType: {
        new (...args: any[]): TContentType;
    }): {
        new (...args: any[]): TControlBaseType;
    };
    private _fieldSettingDefaults;
    /**
     *
     * @param fieldSetting The FieldSetting to get the control for.
     * @param setupControl Callback method that returns a Control Type based on the provided FieldSetting
     * @returns the Mapper instance (can be used fluently)
     */
    SetupFieldSettingDefault<TFieldSettingType extends FieldSettings.FieldSetting>(fieldSetting: {
        new (...args: any[]): TFieldSettingType;
    }, setupControl: (fieldSetting: TFieldSettingType) => {
        new (...args: any[]): TControlBaseType;
    }): this;
    /**
     * @returns {TControlBaseType} The specified FieldSetting control
     * @param fieldSetting The FieldSetting to get the control class.
     */
    GetControlForFieldSetting<TFieldSettingType extends FieldSettings.FieldSetting>(fieldSetting: TFieldSettingType): {
        new (...args: any[]): TControlBaseType;
    };
    private _contentTypeBoundfieldSettings;
    /**
     *
     * @param contentType The Content Type
     * @param fieldName The name of the field on the Content Type
     * @param setupControl The callback function that will setup the Control
     * @param fieldSetting Optional type hint for the FieldSetting
     */
    SetupFieldSettingForControl<TFieldSettingType extends FieldSettings.FieldSetting, TContentType extends IContent, TField extends keyof TContentType>(contentType: {
        new (...args: any[]): TContentType;
    }, fieldName: TField, setupControl: (fieldSetting: TFieldSettingType) => {
        new (...args: any[]): TControlBaseType;
    }, fieldSetting?: {
        new (...args: any[]): TFieldSettingType;
    }): this;
    /**
     *
     * @param contentType The type of the content (e.g. ContentTypes.Task)
     * @param fieldName The name of the field (must be one of the ContentType's fields), e.g. 'DisplayName'
     * @param actionName The name of the Action (can be 'new' / 'edit' / 'view')
     * @returns The assigned Control constructor or the default Field control
     */
    GetControlForContentField<TContentType extends IContent, TField extends keyof TContentType>(contentType: {
        new (...args: any[]): TContentType;
    }, fieldName: TField, actionName: ActionName): {
        new (...args: any[]): TControlBaseType;
    };
    private _fieldSettingBoundClientSettingFactories;
    /**
     * Sets up a Factory method to create library-specific settings from FieldSettings per type
     * @param fieldSettingType The type of the FieldSetting (e.g. FieldSettings.ShortTextFieldSetting)
     * @param factoryMethod The factory method that constructs or transforms the Settings object
     */
    SetClientControlFactory<TFieldSetting extends FieldSettings.FieldSetting>(fieldSettingType: {
        new (...args: any[]): TFieldSetting;
    }, factoryMethod: (setting: TFieldSetting) => TClientControlSettings): this;
    /**
     * Creates a ClientSetting from a specified FieldSetting based on the assigned Factory method
     * @param fieldSetting The FieldSetting object that should be used for creating the new Setting entry
     * @returns the created or transformed Client Setting
     */
    CreateClientSetting<TFieldSetting extends FieldSettings.FieldSetting>(fieldSetting: TFieldSetting): TClientControlSettings;
    /**
     * Gets the full ControlSchema object for a specific ContentType
     * @param contentType The type of the Content (e.g. ContentTypes.Task)
     * @param actionName The name of the Action (can be 'new' / 'edit' / 'view')
     * @returns the fully created ControlSchema
     */
    GetFullSchemaForContentType<TContentType extends IContent, K extends keyof TContentType>(contentType: {
        new (...args: any[]): TContentType;
    }, actionName: ActionName): ControlSchema<TControlBaseType, TClientControlSettings>;
    /**
     * Gets the full ControlSchema object for a specific Content
     * @param contentType The type of the Content (e.g. ContentTypes.Task)
     * @param actionName The name of the Action (can be 'new' / 'edit' / 'view')
     * @returns the fully created ControlSchema
     */
    GetFullSchemaForContent<TContentType extends IContent>(content: TContentType, actionName: ActionName): ControlSchema<TControlBaseType, TClientControlSettings>;
}
