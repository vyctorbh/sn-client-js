"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module Repository
 */
/** */
const JwtService_1 = require("../Authentication/JwtService");
const snconfigmodel_1 = require("../Config/snconfigmodel");
const RxAjaxHttpProvider_1 = require("../HttpProviders/RxAjaxHttpProvider");
const _1 = require("./");
/**
 * This class defines a defaul sense NET ECM Repository implementation
 * that uses an RxJs based Ajax HTTP Provider and a JWT Token Authentication Service
 */
class SnRepository extends _1.BaseRepository {
    /**
     * @param {Partial<SnConfigModel>} config The partial config entry used by the repository
     */
    constructor(config) {
        super(new snconfigmodel_1.SnConfigModel(config), RxAjaxHttpProvider_1.RxAjaxHttpProvider, JwtService_1.JwtService);
    }
}
exports.SnRepository = SnRepository;
//# sourceMappingURL=SnRepository.js.map