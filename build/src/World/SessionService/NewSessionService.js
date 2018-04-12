"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceSchema_1 = require("../../ServiceSchema");
class NewSessionService extends ServiceSchema_1.ServiceSchema {
    get name() {
        return 'world.sessions';
    }
    get actions() {
        return {
            connected: this.connected,
        };
    }
    connected(ctx) {
        this.logger.debug(`received new connection ${ctx.params.address} with id ${ctx.params.uuid}`);
    }
}
exports.NewSessionService = NewSessionService;
//# sourceMappingURL=NewSessionService.js.map