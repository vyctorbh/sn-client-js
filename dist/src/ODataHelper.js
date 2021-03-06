"use strict";
/**
 * @module ODataHelper
 * @preferred
 *
 * @description Helper methods for OData Operations
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
const ODATA_PARAMS = ['select', 'expand', 'orderby', 'top', 'skip', 'filter', 'format', 'inlinecount'];
exports.DATA_ROOT = 'OData.svc';
exports.combineODataFieldParameters = (...params) => {
    params.forEach((param) => {
        if (typeof param === 'string') {
            param = [param];
        }
    });
    params = params.filter((param) => param && param.length > 0);
    return [...new Set([].concat.apply([], params))];
};
/**
 * Method to build proper parameter string to OData requests based on the given option Object.
 *
 * Checks whether a given parameter is standard OData param or not and based on this information this params get the '$' sign.
 *
 * If there's no select param given, or it is empty 'Id' is the default, so only this field will be on the content in the JSON result. To get all the field values, without selection, set it to 'all', but please avoid this if it's possible.
 * @param {IODataOptions} options Represents an ODataOptions obejct based through the IODataOptions interface. Holds the possible url parameters as properties.
 * @returns {string} String with the url params in the correct format e.g. '$select=DisplayName,Index'&$top=2&metadata=no'.
 */
exports.buildUrlParamString = (config, options) => {
    if (!options) {
        return '';
    }
    if (config.RequiredSelect === 'all' || config.DefaultSelect === 'all' || options.select === 'all') {
        options.select = undefined;
    }
    else {
        options.select = exports.combineODataFieldParameters(config.RequiredSelect, options.select || config.DefaultSelect);
    }
    options.metadata = options.metadata || config.DefaultMetadata;
    options.inlinecount = options.inlinecount || config.DefaultInlineCount;
    options.expand = options.expand || config.DefaultExpand;
    options.top = options.top || config.DefaultTop;
    const segments = [];
    // tslint:disable-next-line:forin
    for (const key in options) {
        const name = ODATA_PARAMS.indexOf(key) > -1 ? `$${key}` : key;
        const plainValue = options[key];
        let parsedValue = plainValue;
        if (plainValue instanceof Array && plainValue.length && plainValue.length > 0) {
            parsedValue = plainValue.map((v) => v.join && v.join(' ') || v).join(',');
        }
        if (name && parsedValue && parsedValue.length) {
            segments.push({ name, value: parsedValue });
        }
    }
    return segments.map((s) => `${s.name}=${s.value}`).join('&');
};
/**
 * Method that gets the URL that refers to a single item in the Sense/Net Content Repository
 * @param path {string} Path that you want to format.
 * @returns {string} Path in entity format e.g. /workspaces('project') from /workspaces/project
 */
exports.getContentURLbyPath = (path) => {
    if (typeof path === 'undefined' || path.indexOf('/') < 0 || path.length <= 1) {
        throw new Error('This is not a valid path.');
    }
    if (exports.isItemPath(path)) {
        return path;
    }
    const lastSlashPosition = path.lastIndexOf('/');
    const name = path.substring(lastSlashPosition + 1);
    const parentPath = path.substring(0, lastSlashPosition);
    let url;
    if (name.indexOf('Root') > -1) {
        url = `${parentPath}/('${name}')`;
    }
    else {
        url = `${parentPath}('${name}')`;
    }
    return url;
};
/**
 * Method that gets the URL that refers to a single item in the Sense/Net Content Repository by its Id
 * @param id {number} Id of the Content.
 * @returns {string} e.g. /content(123)
 */
exports.getContentUrlbyId = (id) => {
    return `/content(${id})`;
};
/**
 * Method that tells if a path is an item path.
 * @param path {string} Path that you want to test.
 * @returns {boolean} Returns if the given path is a path of a Content or not.
 */
exports.isItemPath = (path) => {
    return path.indexOf("('") >= 0 && path.indexOf("')") === path.length - 2;
};
/**
 * Method that allows to join paths without multiple or missing slashes
 * @param args The list of the paths to join
 */
exports.joinPaths = (...args) => {
    const trimSlashes = (path) => {
        if (path.endsWith('/')) {
            path = path.substring(0, path.length - 1);
        }
        if (path.startsWith('/')) {
            path = path.substring(1, path.length);
        }
        return path;
    };
    return args.map(trimSlashes).join('/');
};
//# sourceMappingURL=ODataHelper.js.map