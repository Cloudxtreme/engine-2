"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObjectType_1 = require("./ObjectTypes/WorldObjectType");
const SnapshotDataService_1 = require("./Services/DataServices/SnapshotDataService");
exports.DEFAULT_CONFIG = {
    redis: "redis://localhost:6379",
    transporter: "redis://localhost:6379",
};
exports.World = (options = {}) => {
    const config = Object.assign({}, exports.DEFAULT_CONFIG, options);
    return {
        nodeID: "lucid-world",
        transporter: config.transporter,
        validation: true,
        logLevel: "debug",
        heartbeatInterval: 0.5,
        created: (broker) => {
            global.broker = broker;
            global.config = config;
            broker.createService(SnapshotDataService_1.SnapshotDataService(config));
            broker.logger.debug("creating world...");
            this.world = new WorldObjectType_1.WorldObjectType();
        },
    };
};
//# sourceMappingURL=World.js.map