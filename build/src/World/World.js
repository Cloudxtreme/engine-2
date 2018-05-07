"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataService_1 = require("./DataServices/DataService");
const Player_1 = require("./DataServices/Player");
const WorldLoop_1 = require("./WorldLoop");
exports.DEFAULT_CONFIG = {
    redis: 'redis://localhost:6379',
    transporter: 'nats://localhost:4222',
};
exports.World = (options = {}) => {
    const config = Object.assign({}, exports.DEFAULT_CONFIG, options);
    return {
        nodeID: 'lucid-world',
        transporter: config.transporter,
        validation: true,
        heartbeatInterval: 0.5,
        created: (broker) => {
            broker.createService(WorldLoop_1.WorldLoop(config));
            broker.createService(DataService_1.DataService(Player_1.Player(config)));
        },
    };
};
//# sourceMappingURL=World.js.map