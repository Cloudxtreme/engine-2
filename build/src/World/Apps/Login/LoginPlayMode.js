"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPlayMode = {
    initialState: {
        currentStep: 0,
    },
    started() {
        this.logger.debug(`received connection on ${this.metadata.remoteAddress}'`);
    },
};
//# sourceMappingURL=LoginPlayMode.js.map