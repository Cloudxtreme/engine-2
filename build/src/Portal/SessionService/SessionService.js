"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceSchema_1 = require("../../ServiceSchema");
class SessionService extends ServiceSchema_1.ServiceSchema {
    get name() {
        return `portal.player.${this.metadata.uuid}`;
    }
    constructor(broker, socket, options) {
        super(broker, options);
        this.socket = socket;
    }
    schema() {
        const schema = super.schema();
        return Object.assign({}, schema, { created: this.created() });
    }
    created() {
        const socket = this.socket;
        return () => {
            this.socket = socket;
            this.logger.debug(`connected from ${this.metadata.remoteAddress}`);
            this.broker.broadcast('player.connected', this.metadata);
        };
    }
}
exports.SessionService = SessionService;
//# sourceMappingURL=SessionService.js.map