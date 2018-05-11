"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Snapshot_1 = require("./DataServices/Snapshot");
const Object_1 = require("./DataServices/Object");
const Player_1 = require("./DataServices/Player");
const WorldLoop_1 = require("./WorldLoop");
const State_1 = require("./State");
exports.DEFAULT_CONFIG = {
    redis: 'redis://localhost:6379',
    transporter: 'redis://localhost:6379',
};
exports.World = (options = {}) => {
    const config = Object.assign({}, exports.DEFAULT_CONFIG, options);
    return {
        nodeID: 'lucid-world',
        transporter: config.transporter,
        validation: true,
        logLevel: 'debug',
        heartbeatInterval: 0.5,
        created: (broker) => {
            broker.createService(WorldLoop_1.WorldLoop(config));
            broker.createService(Player_1.Player(config));
            broker.createService(Snapshot_1.Snapshot(config));
            broker.createService(Object_1.Object(config));
            broker.createService(State_1.State(config));
        },
    };
};
//# sourceMappingURL=World.js.map