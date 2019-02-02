/**
 * @module Schemas
 * @preferred
 * @description Module for ContentType schemas.
 *
 * A Content Type Definition in Sense/Net is an xml-format configuration file for defining Content Types. The xml configuration (CTD) holds information about the types name and description
 * properties that control how content of this type look and behave (icon, preview generation, indexing), set of fields, etc. This information about the type and its Fields helps us for example
 * building forms. Based on the Field definitions we can render a Field with its DisplayName as a label or validate the Field on save by its validation related configs.
 *
 * This module provides us description of this Content schemas in Typesript.
 *
 * The ```Schema``` class represents an object that holds the basic information about the Content Type (name, icon, ect.) and an array of its ```FieldSettings``` and their full configuration.
 */ /** */
import * as FieldSettings from './FieldSettings';
export declare const isSchema: (schema: Schema) => boolean;
/**
 * Class that represents a Schema.
 *
 * It represents an object that holds the basic information about the Content Type (name, icon, ect.) and an array of its ```FieldSettings``` and their full configuration.
 */
export declare class Schema {
    ContentTypeName: string;
    ParentTypeName?: string;
    Icon: string;
    DisplayName: string;
    Description: string;
    AllowIndexing: boolean;
    AllowIncrementalNaming: boolean;
    AllowedChildTypes: string[];
    FieldSettings: FieldSettings.FieldSetting[];
}
export declare const SchemaStore: Schema[];
