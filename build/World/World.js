"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StateService_1 = require("./Services/StateService");
const SnapshotDataService_1 = require("./Services/DataServices/SnapshotDataService");
/**
 * The World process runs the actual implementation of the game. It is a Moleculer broker process that spins up the
 * various services required to run the game world. It can be configured by passing in the configuration values to the
 * function.
 */
exports.World = (config = {}) => {
    const created = (broker) => {
        broker.createService(SnapshotDataService_1.SnapshotDataService());
        broker.createService(StateService_1.StateService());
        if (config.onCreate) {
            config.onCreate.call(broker);
        }
    };
    const started = (broker) => {
        if (config.onStart) {
            config.onStart.call(broker);
        }
    };
    const stopped = (broker) => {
        if (config.onCreate) {
            config.onStop.call(broker);
        }
    };
    return {
        nodeID: "lucid-mud",
        transporter: config.transporter || "nats://localhost:4222",
        logger: console,
        logLevel: config.logLevel || "debug",
        created,
        started,
        stopped,
    };
};
