"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceSchema_1 = require("../../ServiceSchema");
const Login_1 = require("../PlayModes/Login");
class SessionService extends ServiceSchema_1.ServiceSchema {
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
        ctx.broker.createService(new Login_1.Login(this.broker, { settings: { uuid: ctx.params.uuid } }).schema());
    }
}
exports.SessionService = SessionService;
//# sourceMappingURL=SessionService.js.map