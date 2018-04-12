"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceSchema_1 = require("../../ServiceSchema");
class SessionService extends ServiceSchema_1.ServiceSchema {
    get name() {
        return `world.sessions.${this.serviceSettings.uuid}`;
    }
}
exports.SessionService = SessionService;
//# sourceMappingURL=SessionService.js.map