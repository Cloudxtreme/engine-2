"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceSchema_1 = require("../../ServiceSchema");
const PlayModes_1 = require("../PlayModes");
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
        const loginPlayMode = new PlayModes_1.LoginPlayMode(this.broker, {
            metadata: payload,
        });
        this.broker.createService(loginPlayMode.schema());
    }
}
exports.WorldLoop = WorldLoop;
//# sourceMappingURL=WorldLoop.js.map