"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceSchema_1 = require("../../ServiceSchema");
class SessionService extends ServiceSchema_1.ServiceSchema {
    constructor(broker, options) {
        super(broker, options);
        this.socket = options.socket;
    }
    get name() {
        return `portal.sessions.${this.serviceSettings.uuid}`;
    }
    created() {
        const socket = this.socket;
        return function () {
            this.socket = socket;
            this.logger.debug(`received connection from ${this.socket.remoteAddress}`);
            this.broker.call('world.sessions.connected', {
                address: this.socket.remoteAddress,
                uuid: this.settings.uuid,
            });
        };
    }
    schema() {
        const schema = super.schema();
        return Object.assign({}, schema, { created: this.created() });
    }
}
exports.SessionService = SessionService;
//# sourceMappingURL=SessionService.js.map