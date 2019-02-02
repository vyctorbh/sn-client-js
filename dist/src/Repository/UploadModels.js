"use strict";
/**
 * @module Content
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
class UploadOptions {
}
exports.UploadOptions = UploadOptions;
class UploadFileOptions extends UploadOptions {
}
exports.UploadFileOptions = UploadFileOptions;
class UploadTextOptions extends UploadOptions {
}
exports.UploadTextOptions = UploadTextOptions;
class UploadFromEventOptions extends UploadOptions {
}
exports.UploadFromEventOptions = UploadFromEventOptions;
class UploadProgressInfo {
}
exports.UploadProgressInfo = UploadProgressInfo;
class SaveBinaryFileOptions {
}
exports.SaveBinaryFileOptions = SaveBinaryFileOptions;
class UploadResponse {
    constructor(...args) {
        this.ContentId = parseInt(args[0], 0);
        this.ChunkToken = args[1];
        this.MustFinialize = args[2];
        this.MustCheckin = args[3];
    }
}
exports.UploadResponse = UploadResponse;
//# sourceMappingURL=UploadModels.js.map