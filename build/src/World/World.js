"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppManager_1 = require("./AppManager");
const Object_1 = require("./DataServices/Object");
const Player_1 = require("./DataServices/Player");
const Snapshot_1 = require("./DataServices/Snapshot");
const State_1 = require("./State");
const ObjectService_1 = require("./Objects/ObjectService");
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
            broker.createService(AppManager_1.AppManager(config));
            broker.createService(Player_1.Player(config));
            broker.createService(Snapshot_1.Snapshot(config));
            broker.createService(Object_1.Object(config));
            broker.createService(State_1.State(config));
            broker.createService(ObjectService_1.ObjectService(config));
        },
    };
};
//# sourceMappingURL=World.js.map