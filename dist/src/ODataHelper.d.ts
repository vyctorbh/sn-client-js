/**
 * @module ODataHelper
 * @preferred
 *
 * @description Helper methods for OData Operations
 */ /** */
import { SnConfigModel } from './Config/snconfigmodel';
import { IContent } from './Content';
import { IODataParams, ODataFieldParameter } from './ODataApi';
import { Content } from './SN';
export declare const DATA_ROOT = "OData.svc";
export declare const combineODataFieldParameters: <T extends IContent>(...params: ODataFieldParameter<T>[]) => ODataFieldParameter<Content<T>>;
/**
 * Method to build proper parameter string to OData requests based on the given option Object.
 *
 * Checks whether a given parameter is standard OData param or not and based on this information this params get the '$' sign.
 *
 * If there's no select param given, or it is empty 'Id' is the default, so only this field will be on the content in the JSON result. To get all the field values, without selection, set it to 'all', but please avoid this if it's possible.
 * @param {IODataOptions} options Represents an ODataOptions obejct based through the IODataOptions interface. Holds the possible url parameters as properties.
 * @returns {string} String with the url params in the correct format e.g. '$select=DisplayName,Index'&$top=2&metadata=no'.
 */
export declare const buildUrlParamString: <T extends IContent = IContent>(config: SnConfigModel, options?: IODataParams<T>) => string;
/**
 * Method that gets the URL that refers to a single item in the Sense/Net Content Repository
 * @param path {string} Path that you want to format.
 * @returns {string} Path in entity format e.g. /workspaces('project') from /workspaces/project
 */
export declare const getContentURLbyPath: (path: string) => string;
/**
 * Method that gets the URL that refers to a single item in the Sense/Net Content Repository by its Id
 * @param id {number} Id of the Content.
 * @returns {string} e.g. /content(123)
 */
export declare const getContentUrlbyId: (id: number) => string;
/**
 * Method that tells if a path is an item path.
 * @param path {string} Path that you want to test.
 * @returns {boolean} Returns if the given path is a path of a Content or not.
 */
export declare const isItemPath: (path: string) => boolean;
/**
 * Method that allows to join paths without multiple or missing slashes
 * @param args The list of the paths to join
 */
export declare const joinPaths: (...args: string[]) => string;
