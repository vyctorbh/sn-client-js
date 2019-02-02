"use strict";
/**
 * @module Config
 */ /** */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const snconfigbehavior_1 = require("./snconfigbehavior");
const snconfigfielddecorator_1 = require("./snconfigfielddecorator");
/**
 * Class that represents a typed model for the Sense/Net related configuration for an NPM Package. The values can be populated from sn.config.js.
 */
class SnConfigModel {
    /**
     *
     * @param {Partial<SnConfigMoel>} config Partial config values, the default values will be overwritten if provided
     * @constructs {SnConfigModel}
     */
    constructor(config) {
        /**
         * The root URL for the Sense/Net repository (e.g.: demo.sensenet.com)
         */
        this.RepositoryUrl = SnConfigModel.DEFAULT_BASE_URL;
        /**
         * The service token for the OData Endpoint
         */
        this.ODataToken = SnConfigModel.DEFAULT_SERVICE_TOKEN;
        /**
         * This string represents how the Jwt Web Token will be stored in the localStorage.
         */
        this.JwtTokenKeyTemplate = 'sn-${siteName}-${tokenName}';
        /**
         * This string describes how long the JWT token should be persisted.
         */
        this.JwtTokenPersist = 'session';
        /**
         * This parameter describes what fields should be included in the OData $select statements by default
         */
        this.DefaultSelect = ['DisplayName', 'Description', 'Icon'];
        /**
         * This parameter describes what fields should always be included in the OData $select statements
         */
        this.RequiredSelect = ['Id', 'Path', 'Name', 'Type'];
        /**
         * This field sets the default OData $metadata value
         */
        this.DefaultMetadata = 'no';
        /**
         * This field sets the default OData inline count value
         */
        this.DefaultInlineCount = 'allpages';
        /**
         * This field describes what fields should be expanded on every OData request by default
         */
        this.DefaultExpand = undefined;
        /**
         * This field sets up a default OData $top parameter
         */
        this.DefaultTop = 1000;
        /**
         * Chunk size for chunked uploads, must be equal to BinaryChunkSize setting at the backend
         */
        this.ChunkSize = 10485760; // 10 mb
        config && Object.assign(this, config);
    }
    /**
     * The default base URL, returns window.location if available
     */
    static get DEFAULT_BASE_URL() {
        if (typeof window !== 'undefined') {
            return (window && window.location && window.location.origin) || '';
        }
        return '';
    }
}
/**
 * The default Sense/Net OData Service token (odata.svc)
 */
SnConfigModel.DEFAULT_SERVICE_TOKEN = 'odata.svc';
__decorate([
    snconfigfielddecorator_1.SnConfigField({
        Behavior: snconfigbehavior_1.SnConfigBehavior.AllowFromConfig | snconfigbehavior_1.SnConfigBehavior.AllowFromCommandLine,
        FieldDescription: 'URL to the repository (e.g.: demo.sensenet.com)',
        Question: 'Please enter your Sense/Net Site URL(e.g.:demo.sensenet.com):',
    }),
    __metadata("design:type", String)
], SnConfigModel.prototype, "RepositoryUrl", void 0);
__decorate([
    snconfigfielddecorator_1.SnConfigField({
        Behavior: snconfigbehavior_1.SnConfigBehavior.AllowFromConfig | snconfigbehavior_1.SnConfigBehavior.AllowFromCommandLine,
        FieldDescription: 'The service token for the OData Endpoint',
        Question: 'Please enter your Sense/Net Site URL(e.g.:demo.sensenet.com):',
    })
    // tslint:disable-next-line:naming-convention
    ,
    __metadata("design:type", String)
], SnConfigModel.prototype, "ODataToken", void 0);
__decorate([
    snconfigfielddecorator_1.SnConfigField({
        Behavior: snconfigbehavior_1.SnConfigBehavior.AllowFromConfig,
        FieldDescription: 'Template will be stored in that format',
        Question: 'Please specify the template format for the key of the JWT Web Token in the localStorage (e.g.: sn-${siteName}-${tokenName})'
    }),
    __metadata("design:type", String)
], SnConfigModel.prototype, "JwtTokenKeyTemplate", void 0);
__decorate([
    snconfigfielddecorator_1.SnConfigField({
        Behavior: snconfigbehavior_1.SnConfigBehavior.AllowFromConfig,
        FieldDescription: 'The behavoir how long the JWT tokens should be persisted, can be "session" or "expiration"',
        Question: ''
    }),
    __metadata("design:type", String)
], SnConfigModel.prototype, "JwtTokenPersist", void 0);
__decorate([
    snconfigfielddecorator_1.SnConfigField({
        Behavior: snconfigbehavior_1.SnConfigBehavior.AllowFromConfig,
        FieldDescription: 'The default values to select when triggering an OData Action',
        Question: ''
    }),
    __metadata("design:type", Object)
], SnConfigModel.prototype, "DefaultSelect", void 0);
__decorate([
    snconfigfielddecorator_1.SnConfigField({
        Behavior: snconfigbehavior_1.SnConfigBehavior.AllowFromConfig,
        FieldDescription: 'The values are required when triggering an OData Action and will be always included in Select statements',
        Question: ''
    }),
    __metadata("design:type", Object)
], SnConfigModel.prototype, "RequiredSelect", void 0);
__decorate([
    snconfigfielddecorator_1.SnConfigField({
        Behavior: snconfigbehavior_1.SnConfigBehavior.AllowFromConfig,
        FieldDescription: 'The default OData metadata option',
        Question: ''
    }),
    __metadata("design:type", String)
], SnConfigModel.prototype, "DefaultMetadata", void 0);
__decorate([
    snconfigfielddecorator_1.SnConfigField({
        Behavior: snconfigbehavior_1.SnConfigBehavior.AllowFromConfig,
        FieldDescription: 'The default OData inline count option',
        Question: ''
    }),
    __metadata("design:type", String)
], SnConfigModel.prototype, "DefaultInlineCount", void 0);
__decorate([
    snconfigfielddecorator_1.SnConfigField({
        Behavior: snconfigbehavior_1.SnConfigBehavior.AllowFromConfig,
        FieldDescription: 'The default OData references to expand',
        Question: ''
    }),
    __metadata("design:type", Object)
], SnConfigModel.prototype, "DefaultExpand", void 0);
__decorate([
    snconfigfielddecorator_1.SnConfigField({
        Behavior: snconfigbehavior_1.SnConfigBehavior.AllowFromConfig,
        FieldDescription: 'The default OData $top parameter for querying / fetching content',
        Question: ''
    }),
    __metadata("design:type", Number)
], SnConfigModel.prototype, "DefaultTop", void 0);
__decorate([
    snconfigfielddecorator_1.SnConfigField({
        Behavior: snconfigbehavior_1.SnConfigBehavior.AllowFromConfig,
        FieldDescription: 'Chunk size for chunked uploads, must be equal to BinaryChunkSize setting at the backend',
        Question: ''
    }),
    __metadata("design:type", Number)
], SnConfigModel.prototype, "ChunkSize", void 0);
exports.SnConfigModel = SnConfigModel;
//# sourceMappingURL=snconfigmodel.js.map