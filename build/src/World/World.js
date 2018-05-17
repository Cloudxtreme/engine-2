"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppManagerService_1 = require("./Services/AppManagerService");
const ObjectDataService_1 = require("./Services/DataServices/ObjectDataService");
const PlayerDataService_1 = require("./Services/DataServices/PlayerDataService");
const SnapshotDataService_1 = require("./Services/DataServices/SnapshotDataService");
const ObjectService_1 = require("./Services/ObjectService");
const StateService_1 = require("./Services/StateService");
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
            broker.createService(AppManagerService_1.AppManagerService(config));
            broker.createService(PlayerDataService_1.PlayerDataService(config));
            broker.createService(SnapshotDataService_1.SnapshotDataService(config));
            broker.createService(ObjectDataService_1.ObjectDataService(config));
            broker.createService(StateService_1.StateService(config));
            broker.createService(ObjectService_1.ObjectService(config));
        },
    };
};
//# sourceMappingURL=World.js.map