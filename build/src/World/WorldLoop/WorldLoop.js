"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PlayModes_1 = require("../PlayModes");
exports.WorldLoop = (config) => {
    return {
        name: 'world.loop',
        metadata: Object.assign({}, config),
        events: {
            'player.connected': function (payload) {
                this.broker.createService(PlayModes_1.PlayMode(PlayModes_1.LoginPlayMode)(payload));
            },
            'player.disconnected': function (payload) {
                this.broker.destroyService(this.broker.getLocalService(`world.player.${payload.uuid}`));
            },
        },
    };
};
//# sourceMappingURL=WorldLoop.js.map