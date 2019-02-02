"use strict";
/**
 * @module Repository
 * @preferred
 *
 * @description This module contains models for Sense/Net ECM's GetVersionInfo custom action
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The type of a specific package
 */
var PackageType;
(function (PackageType) {
    /**
     * Can contain small repeatable activities that do not perform significant changes but can be important because of business or technical reasons. A good example is performing an undo checkout on multiple content. Executing a package of this level does not change the application's or the product's version number but the execution is logged and registered
     */
    PackageType[PackageType["Tool"] = 0] = "Tool";
    /**
     * Contains small modifications (e.g. a couple of new content to import or a bugfix in a dll). Usually patches form a chain where every package assumes the existence of all the previous ones but it is not mandatory. It is possible to control this behavior, see version control below.
     */
    PackageType[PackageType["Patch"] = 1] = "Patch";
    /**
     *  An application's first package must be an 'install' package. This is the package that injects a new application into the system. Only Application packages can be set on this level. An install level package must contain a new application identifier that is unknown to the system. Packages on this level can be executed only once.
     */
    PackageType[PackageType["Install"] = 2] = "Install";
})(PackageType = exports.PackageType || (exports.PackageType = {}));
/**
 * Represents a .NET Assembly in the Version Info
 */
class Assembly {
}
exports.Assembly = Assembly;
/**
 * Represents a Sense/NET ECM Component in the Version Info
 */
class Component {
}
exports.Component = Component;
/**
 * Represents a Sense/NET ECM Package in the Version Info
 */
class Package {
}
exports.Package = Package;
/**
 * Represents a model for the Sense/NET ECM's GetVersionInfo custom action's response
 */
class VersionInfo {
}
exports.VersionInfo = VersionInfo;
//# sourceMappingURL=VersionInfoModels.js.map