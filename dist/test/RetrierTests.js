"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Chai = require("chai");
const mocha_typescript_1 = require("mocha-typescript");
const SN_1 = require("../src/SN");
const expect = Chai.expect;
let RetrierTests = class RetrierTests {
    'Simple Counter'() {
        return __awaiter(this, void 0, void 0, function* () {
            let count = 0;
            yield SN_1.Retrier.Create(() => __awaiter(this, void 0, void 0, function* () {
                count = count + 1;
                return count === 3;
            })).Run();
            expect(count).to.be.eq(3);
        });
    }
    'onSuccess has been triggered'() {
        return __awaiter(this, void 0, void 0, function* () {
            let triggered = false;
            yield SN_1.Retrier.Create(() => __awaiter(this, void 0, void 0, function* () { return true; }))
                .Setup({
                OnSuccess: () => {
                    triggered = true;
                }
            }).Run();
            expect(triggered).to.be.eq(true);
        });
    }
    'onTimeout has been triggered'() {
        return __awaiter(this, void 0, void 0, function* () {
            let triggered = false;
            yield SN_1.Retrier.Create(() => __awaiter(this, void 0, void 0, function* () { return false; }))
                .Setup({
                OnFail: () => {
                    triggered = true;
                },
                TimeoutMs: 1
            }).Run();
            expect(triggered).to.be.eq(true);
        });
    }
    'onTry has been triggered'() {
        return __awaiter(this, void 0, void 0, function* () {
            let triggered = false;
            yield SN_1.Retrier.Create(() => __awaiter(this, void 0, void 0, function* () { return true; }))
                .Setup({
                OnTry: () => {
                    triggered = true;
                }
            })
                .Run();
            expect(triggered).to.be.eq(true);
        });
    }
    'exampleTest'() {
        return __awaiter(this, void 0, void 0, function* () {
            const funcToRetry = () => __awaiter(this, void 0, void 0, function* () {
                const hasSucceeded = false;
                // ...
                // custom logic
                // ...
                return hasSucceeded;
            });
            const retrierSuccess = yield SN_1.Retrier.Create(funcToRetry)
                .Setup({
                Retries: 3,
                RetryIntervalMs: 1,
                TimeoutMs: 1000
            })
                .Run();
            expect(retrierSuccess).to.be.eq(false);
        });
    }
    'Should throw error when started twice'() {
        return __awaiter(this, void 0, void 0, function* () {
            const retrier = SN_1.Retrier.Create(() => __awaiter(this, void 0, void 0, function* () { return false; }));
            retrier.Run();
            try {
                yield retrier.Run();
                throw new Error('Should have failed.');
            }
            catch (error) {
                //
            }
        });
    }
    'Should throw error when trying to set up after started'() {
        const retrier = SN_1.Retrier.Create(() => __awaiter(this, void 0, void 0, function* () { return false; }));
        retrier.Run();
        expect(() => {
            retrier.Setup({
                Retries: 2
            });
        }).to.throw();
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RetrierTests.prototype, "Simple Counter", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RetrierTests.prototype, "onSuccess has been triggered", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RetrierTests.prototype, "onTimeout has been triggered", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RetrierTests.prototype, "onTry has been triggered", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RetrierTests.prototype, "exampleTest", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RetrierTests.prototype, "Should throw error when started twice", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RetrierTests.prototype, "Should throw error when trying to set up after started", null);
RetrierTests = __decorate([
    mocha_typescript_1.suite('Retrier Tests')
], RetrierTests);
exports.RetrierTests = RetrierTests;
//# sourceMappingURL=RetrierTests.js.map