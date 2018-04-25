"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceSchema_1 = require("../../ServiceSchema");
class SessionService extends ServiceSchema_1.ServiceSchema {
    constructor(broker, options) {
        super(broker, options);
    }
    created() {
        this.socket = this.settings.socket;
        this.logger.debug(`connected from ${this.metadata.remoteAddress}`);
        this.broker.broadcast('player.connected', this.metadata);
    }
}
exports.SessionService = SessionService;
//# sourceMappingURL=SessionService.js.map