"use strict";
/**
 * @module Mocks
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../../src/Config");
const index_1 = require("../../src/Repository/index");
const MockAuthService_1 = require("./MockAuthService");
const MockHttpProvider_1 = require("./MockHttpProvider");
class MockRepository extends index_1.BaseRepository {
    constructor(config) {
        if (!config) {
            config = new Config_1.SnConfigModel();
        }
        super(config, MockHttpProvider_1.MockHttpProvider, MockAuthService_1.MockAuthService);
    }
}
exports.MockRepository = MockRepository;
//# sourceMappingURL=MockRepository.js.map