"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Enum for Field visibility values.
 */
var FieldVisibility;
(function (FieldVisibility) {
    FieldVisibility[FieldVisibility["Show"] = 0] = "Show";
    FieldVisibility[FieldVisibility["Hide"] = 1] = "Hide";
    FieldVisibility[FieldVisibility["Advanced"] = 2] = "Advanced";
})(FieldVisibility = exports.FieldVisibility || (exports.FieldVisibility = {}));
/**
 * Enum for Field output method values.
 */
var OutputMethod;
(function (OutputMethod) {
    OutputMethod[OutputMethod["Default"] = 0] = "Default";
    OutputMethod[OutputMethod["Raw"] = 1] = "Raw";
    OutputMethod[OutputMethod["Text"] = 2] = "Text";
    OutputMethod[OutputMethod["Html"] = 3] = "Html";
})(OutputMethod = exports.OutputMethod || (exports.OutputMethod = {}));
/**
 * Enum for Choice Field control values.
 */
var DisplayChoice;
(function (DisplayChoice) {
    DisplayChoice[DisplayChoice["DropDown"] = 0] = "DropDown";
    DisplayChoice[DisplayChoice["RadioButtons"] = 1] = "RadioButtons";
    DisplayChoice[DisplayChoice["CheckBoxes"] = 2] = "CheckBoxes";
})(DisplayChoice = exports.DisplayChoice || (exports.DisplayChoice = {}));
/**
 * Enum for DateTime Field mode values.
 */
var DateTimeMode;
(function (DateTimeMode) {
    DateTimeMode[DateTimeMode["None"] = 0] = "None";
    DateTimeMode[DateTimeMode["Date"] = 1] = "Date";
    DateTimeMode[DateTimeMode["DateAndTime"] = 2] = "DateAndTime";
})(DateTimeMode = exports.DateTimeMode || (exports.DateTimeMode = {}));
/**
 * Enum for DateTime Field precision values.
 */
var DateTimePrecision;
(function (DateTimePrecision) {
    DateTimePrecision[DateTimePrecision["Millisecond"] = 0] = "Millisecond";
    DateTimePrecision[DateTimePrecision["Second"] = 1] = "Second";
    DateTimePrecision[DateTimePrecision["Minute"] = 2] = "Minute";
    DateTimePrecision[DateTimePrecision["Hour"] = 3] = "Hour";
    DateTimePrecision[DateTimePrecision["Day"] = 4] = "Day";
})(DateTimePrecision = exports.DateTimePrecision || (exports.DateTimePrecision = {}));
/**
 * Enum for LongText field editor values.
 */
var TextType;
(function (TextType) {
    TextType[TextType["LongText"] = 0] = "LongText";
    TextType[TextType["RichText"] = 1] = "RichText";
    TextType[TextType["AdvancedRichText"] = 2] = "AdvancedRichText";
})(TextType = exports.TextType || (exports.TextType = {}));
/**
 * Enum for HyperLink field href values.
 */
var UrlFormat;
(function (UrlFormat) {
    UrlFormat[UrlFormat["Hyperlink"] = 0] = "Hyperlink";
    UrlFormat[UrlFormat["Picture"] = 1] = "Picture";
})(UrlFormat = exports.UrlFormat || (exports.UrlFormat = {}));
// tslint:disable-next-line:only-arrow-functions
function isFieldSettingOfType(setting, type) {
    return setting.Type === type.name;
}
exports.isFieldSettingOfType = isFieldSettingOfType;
class FieldSetting {
}
exports.FieldSetting = FieldSetting;
// Used in ContentType, GenericContent, File, Image, TrashBag, TrashBin, Task
class IntegerFieldSetting extends FieldSetting {
}
exports.IntegerFieldSetting = IntegerFieldSetting;
//
class TextFieldSetting extends FieldSetting {
}
exports.TextFieldSetting = TextFieldSetting;
// Used in ContentType, GenericContent, File, ContentList, Device, Domain, Email, OrganizationalUnit, TrashBag, Group, Task, User
class ShortTextFieldSetting extends TextFieldSetting {
}
exports.ShortTextFieldSetting = ShortTextFieldSetting;
// Used in ContentType, GenericContent, Settings, IndexingSettings, ContentList, Workspace, Site, CustomListItem, User
class NullFieldSetting extends FieldSetting {
}
exports.NullFieldSetting = NullFieldSetting;
// Used in ContentType, GenericContent, File, HtmlTemplate, Image, ContentList, Aspect, Email, SmartFolder, Query, User
class LongTextFieldSetting extends TextFieldSetting {
}
exports.LongTextFieldSetting = LongTextFieldSetting;
// Used in ContentType, File, User
class BinaryFieldSetting extends FieldSetting {
}
exports.BinaryFieldSetting = BinaryFieldSetting;
// Used in ContentType, GenericContent, ContentLink, ContentList, ImageLibrary, TrashBag, Workspace, Site, UserProfile, Group, Memo, Task, User
class ReferenceFieldSetting extends FieldSetting {
}
exports.ReferenceFieldSetting = ReferenceFieldSetting;
// Used in ContentType, GenericContent, Image, Domain, Email, OrganizationalUnit, TrashBag, Workspace, Group, Memo, Task, User
class DateTimeFieldSetting extends FieldSetting {
}
exports.DateTimeFieldSetting = DateTimeFieldSetting;
// Used in GenericContent, ContentList, SmartFolder, Site, Memo, Task, Query, User
class ChoiceFieldSetting extends ShortTextFieldSetting {
}
exports.ChoiceFieldSetting = ChoiceFieldSetting;
// Used in GenericContent, File, Resource
class NumberFieldSetting extends FieldSetting {
}
exports.NumberFieldSetting = NumberFieldSetting;
// Used in GenericContent
class RatingFieldSetting extends ShortTextFieldSetting {
}
exports.RatingFieldSetting = RatingFieldSetting;
// Used in User
class PasswordFieldSetting extends ShortTextFieldSetting {
}
exports.PasswordFieldSetting = PasswordFieldSetting;
// Used in User
class CaptchaFieldSetting extends FieldSetting {
}
exports.CaptchaFieldSetting = CaptchaFieldSetting;
//# sourceMappingURL=FieldSettings.js.map