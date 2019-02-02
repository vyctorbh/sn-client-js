/**
 * @module Config
 */ /** */
import { SnConfigBehavior } from './snconfigbehavior';
/**
 * Class that represents a model for a field in the SnConfig (usually sn.config.js) module file
 */
export declare class SnConfigFieldModel {
    /**
     * The name of the field (e.g. RepositoryUrl). This will be used also as a key in command line options and in the sn.config.js module
     */
    FieldName?: string;
    /**
     * The field will be stored with this name in the SnConfigFieldModelStore (usually 'ModelName.FieldName')
     */
    StoreKey?: string;
    /**
     * Optional description. Will be dislpayed in the CLI Help screen.
     */
    FieldDescription?: string;
    /**
     * This question will be asked when the field is needed but not provided.
     */
    Question: string;
    /**
     * The behavoir of the field, can be flagged
     * @default SnConfigBehavior.Default
     */
    Behavior: SnConfigBehavior;
}
