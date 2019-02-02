"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./HttpProviderTests"));
__export(require("./BinaryFieldTests"));
__export(require("./JwtServiceTests"));
__export(require("./CollectionTests"));
__export(require("./ContentTests"));
__export(require("./ContentReferenceFieldTests"));
__export(require("./ContentListReferenceFieldTests"));
__export(require("./ContentSerializerTests"));
__export(require("./ControlMapperTests"));
__export(require("./FieldSettingsTest"));
__export(require("./ComplexTypesTests"));
__export(require("./ODataApiTests"));
__export(require("./ODataHelperTests"));
__export(require("./RepositoryTests"));
__export(require("./RetrierTests"));
__export(require("./SnConfigTests"));
__export(require("./TokenTests"));
__export(require("./TokenStoreTests"));
__export(require("./QueryTests"));
// tslint:disable:naming-convention
global.File = class {
    constructor(fileData, name) {
        this.name = name;
    }
    slice(from, size) {
        return '';
    }
};
//# sourceMappingURL=index.js.map