"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceSchema_1 = require("../../ServiceSchema");
class WorldLoop extends ServiceSchema_1.ServiceSchema {
    constructor() {
        super(...arguments);
        this.name = 'world.loop';
        this.events = {
            'player.connected': this.playerConnected,
        };
    }
    playerConnected(payload) {
        this.logger.debug(`player connected on ${payload.remoteAddress}`);
    }
}
exports.WorldLoop = WorldLoop;
//# sourceMappingURL=WorldLoop.js.map