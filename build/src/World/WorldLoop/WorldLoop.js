"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PlayMode_1 = require("../PlayMode");
exports.WorldLoop = (config) => {
    return {
        name: 'world.loop',
        metadata: Object.assign({}, config),
        events: {
            'player.connected': function (payload) {
                this.broker.createService(PlayMode_1.PlayMode(PlayMode_1.LoginPlayMode)(payload));
            },
            'player.disconnected': function (payload) {
                this.broker.destroyService(this.broker.getLocalService(`world.player.${payload.uuid}`));
            },
        },
    };
};
//# sourceMappingURL=WorldLoop.js.map