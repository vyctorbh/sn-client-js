/**
 * @module FieldSettings
 * @preferred
 *
 * @description Module for FieldSettings.
 *
 * FieldSetting object is the implementation of the configuration element in a Sense/Net Content Type Definition.
 * The FieldSetting of a Field contains properties that define the behavior of the Field - for example a Field can be configured as read only or compulsory to fill.
 * FieldSettings helps us to autogenerate type and schema TS files from Sense/Net CTDs and use these files to reach all the configuration options of the Content Types fields on
 * client-side e.g. for validation.
 *
 * This module also contains some FieldSetting related enums to use them as types in properties e.g. visibitily or datetime mode options.
 */ /** */
import { ComplexTypes } from './SN';
/**
 * Enum for Field visibility values.
 */
export declare enum FieldVisibility {
    Show = 0,
    Hide = 1,
    Advanced = 2,
}
/**
 * Enum for Field output method values.
 */
export declare enum OutputMethod {
    Default = 0,
    Raw = 1,
    Text = 2,
    Html = 3,
}
/**
 * Enum for Choice Field control values.
 */
export declare enum DisplayChoice {
    DropDown = 0,
    RadioButtons = 1,
    CheckBoxes = 2,
}
/**
 * Enum for DateTime Field mode values.
 */
export declare enum DateTimeMode {
    None = 0,
    Date = 1,
    DateAndTime = 2,
}
/**
 * Enum for DateTime Field precision values.
 */
export declare enum DateTimePrecision {
    Millisecond = 0,
    Second = 1,
    Minute = 2,
    Hour = 3,
    Day = 4,
}
/**
 * Enum for LongText field editor values.
 */
export declare enum TextType {
    LongText = 0,
    RichText = 1,
    AdvancedRichText = 2,
}
/**
 * Enum for HyperLink field href values.
 */
export declare enum UrlFormat {
    Hyperlink = 0,
    Picture = 1,
}
export declare function isFieldSettingOfType<T extends FieldSetting>(setting: FieldSetting, type: {
    new (): T;
}): setting is T;
export declare class FieldSetting {
    Name: string;
    Type: string;
    DisplayName?: string;
    Description?: string;
    Icon?: string;
    ReadOnly?: boolean;
    Compulsory?: boolean;
    DefaultValue?: string;
    OutputMethod?: OutputMethod;
    VisibleBrowse?: FieldVisibility;
    VisibleNew?: FieldVisibility;
    VisibleEdit?: FieldVisibility;
    FieldIndex?: number;
    DefaultOrder?: number;
    ControlHint?: string;
}
export declare class IntegerFieldSetting extends FieldSetting {
    MinValue?: number;
    MaxValue?: number;
    ShowAsPercentage?: boolean;
    Step?: number;
}
export declare class TextFieldSetting extends FieldSetting {
    MinLength?: number;
    MaxLength?: number;
}
export declare class ShortTextFieldSetting extends TextFieldSetting {
    Regex?: string;
}
export declare class NullFieldSetting extends FieldSetting {
}
export declare class LongTextFieldSetting extends TextFieldSetting {
    Rows?: number;
    TextType?: TextType;
    AppendModifications?: boolean;
}
export declare class BinaryFieldSetting extends FieldSetting {
    IsText?: boolean;
}
export declare class ReferenceFieldSetting extends FieldSetting {
    AllowMultiple?: boolean;
    AllowedTypes?: string[];
    SelectionRoots?: string[];
    Query?: string;
    FieldName?: string;
}
export declare class DateTimeFieldSetting extends FieldSetting {
    DateTimeMode?: DateTimeMode;
    Precision?: DateTimePrecision;
}
export declare class ChoiceFieldSetting extends ShortTextFieldSetting {
    AllowExtraValue?: boolean;
    AllowMultiple?: boolean;
    Options?: ComplexTypes.ChoiceOption[];
    DisplayChoice?: DisplayChoice;
    EnumTypeName?: string;
}
export declare class NumberFieldSetting extends FieldSetting {
    MinValue?: number;
    MaxValue?: number;
    Digits?: number;
    ShowAsPercentage?: boolean;
    Step?: number;
}
export declare class RatingFieldSetting extends ShortTextFieldSetting {
    Range?: number;
    Split?: number;
}
export declare class PasswordFieldSetting extends ShortTextFieldSetting {
    ReenterTitle?: string;
    ReenterDescription?: string;
    PasswordHistoryLength?: number;
}
export declare class CaptchaFieldSetting extends FieldSetting {
}
