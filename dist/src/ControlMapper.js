"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const FieldSettings = require("./FieldSettings");
class ControlSchema {
}
exports.ControlSchema = ControlSchema;
class ControlMapper {
    constructor(_repository, ControlBaseType, _clientControlSettingsFactory, _defaultControlType, _defaultFieldSettingControlType) {
        this._repository = _repository;
        this.ControlBaseType = ControlBaseType;
        this._clientControlSettingsFactory = _clientControlSettingsFactory;
        this._defaultControlType = _defaultControlType;
        this._defaultFieldSettingControlType = _defaultFieldSettingControlType;
        this._contentTypeControlMaps = new Map();
        this._fieldSettingDefaults = new Map();
        this._contentTypeBoundfieldSettings = new Map();
        this._fieldSettingBoundClientSettingFactories = new Map();
    }
    /**
     * Method for getting a specified Schema object for a content type. The FieldSettings will be filtered based on the provided actionName.
     * @param contentType The type of the content (e.g. ContentTypes.Task)
     * @param actionName The name of the action. Can be 'new' / 'view' / 'edit'
     */
    getTypeSchema(contentType, actionName) {
        const schema = this._repository.GetSchema(contentType);
        if (actionName) {
            schema.FieldSettings = schema.FieldSettings.filter((s) => {
                switch (actionName) {
                    case 'new':
                        return s.VisibleNew === FieldSettings.FieldVisibility.Show;
                    case 'edit':
                        return s.VisibleEdit === FieldSettings.FieldVisibility.Show;
                    case 'view':
                        return s.VisibleBrowse === FieldSettings.FieldVisibility.Show;
                }
            });
        }
        return schema;
    }
    /**
     * Maps a specified Control to a Content type
     * @param content The Content to be mapped
     * @param control The Control for the content
     * @returns {ControlMapper}
     */
    MapContentTypeToControl(contentType, control) {
        this._contentTypeControlMaps.set(contentType.name, control);
        return this;
    }
    /**
     *
     * @param content The content to get the control for.
     * @returns {TControlBaseType} The mapped control, Default if nothing is mapped.
     */
    GetControlForContentType(contentType) {
        const control = this._contentTypeControlMaps.get(contentType.name) || this._defaultControlType;
        if (!control) {
            throw Error('');
        }
        return control;
    }
    /**
     *
     * @param fieldSetting The FieldSetting to get the control for.
     * @param setupControl Callback method that returns a Control Type based on the provided FieldSetting
     * @returns the Mapper instance (can be used fluently)
     */
    SetupFieldSettingDefault(fieldSetting, setupControl) {
        this._fieldSettingDefaults.set(fieldSetting.name, setupControl);
        return this;
    }
    /**
     * @returns {TControlBaseType} The specified FieldSetting control
     * @param fieldSetting The FieldSetting to get the control class.
     */
    GetControlForFieldSetting(fieldSetting) {
        const fieldSettingSetup = this._fieldSettingDefaults.get(fieldSetting.Type);
        return fieldSettingSetup && fieldSettingSetup(fieldSetting) || this._defaultFieldSettingControlType;
    }
    /**
     *
     * @param contentType The Content Type
     * @param fieldName The name of the field on the Content Type
     * @param setupControl The callback function that will setup the Control
     * @param fieldSetting Optional type hint for the FieldSetting
     */
    SetupFieldSettingForControl(contentType, fieldName, setupControl, fieldSetting) {
        this._contentTypeBoundfieldSettings.set(`${contentType.name}-${fieldName}`, setupControl);
        return this;
    }
    /**
     *
     * @param contentType The type of the content (e.g. ContentTypes.Task)
     * @param fieldName The name of the field (must be one of the ContentType's fields), e.g. 'DisplayName'
     * @param actionName The name of the Action (can be 'new' / 'edit' / 'view')
     * @returns The assigned Control constructor or the default Field control
     */
    GetControlForContentField(contentType, fieldName, actionName) {
        const fieldSetting = this.getTypeSchema(contentType, actionName).FieldSettings.filter((s) => s.Name === fieldName)[0];
        if (this._contentTypeBoundfieldSettings.has(`${contentType.name}-${fieldName}`)) {
            return this._contentTypeBoundfieldSettings.get(`${contentType.name}-${fieldName}`)(fieldSetting);
        }
        else {
            return this.GetControlForFieldSetting(fieldSetting);
        }
    }
    /**
     * Sets up a Factory method to create library-specific settings from FieldSettings per type
     * @param fieldSettingType The type of the FieldSetting (e.g. FieldSettings.ShortTextFieldSetting)
     * @param factoryMethod The factory method that constructs or transforms the Settings object
     */
    SetClientControlFactory(fieldSettingType, factoryMethod) {
        this._fieldSettingBoundClientSettingFactories.set(fieldSettingType.name, factoryMethod);
        return this;
    }
    /**
     * Creates a ClientSetting from a specified FieldSetting based on the assigned Factory method
     * @param fieldSetting The FieldSetting object that should be used for creating the new Setting entry
     * @returns the created or transformed Client Setting
     */
    CreateClientSetting(fieldSetting) {
        const factoryMethod = this._fieldSettingBoundClientSettingFactories.get(fieldSetting.Type) || this._clientControlSettingsFactory;
        return factoryMethod(fieldSetting);
    }
    /**
     * Gets the full ControlSchema object for a specific ContentType
     * @param contentType The type of the Content (e.g. ContentTypes.Task)
     * @param actionName The name of the Action (can be 'new' / 'edit' / 'view')
     * @returns the fully created ControlSchema
     */
    GetFullSchemaForContentType(contentType, actionName) {
        const schema = this.getTypeSchema(contentType, actionName);
        const mappings = schema.FieldSettings.map((f) => {
            const clientSetting = this.CreateClientSetting(f);
            const control = this.GetControlForContentField(contentType, f.Name, actionName);
            return {
                FieldSettings: f,
                ClientSettings: clientSetting,
                ControlType: control
            };
        });
        return {
            Schema: schema,
            ContentTypeControl: this.GetControlForContentType(contentType),
            FieldMappings: mappings
        };
    }
    /**
     * Gets the full ControlSchema object for a specific Content
     * @param contentType The type of the Content (e.g. ContentTypes.Task)
     * @param actionName The name of the Action (can be 'new' / 'edit' / 'view')
     * @returns the fully created ControlSchema
     */
    GetFullSchemaForContent(content, actionName) {
        return this.GetFullSchemaForContentType(content.constructor, actionName);
    }
}
exports.ControlMapper = ControlMapper;
//# sourceMappingURL=ControlMapper.js.map