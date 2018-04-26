"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prettyJson = require("prettyjson");
const BrokerSchema_1 = require("../BrokerSchema");
const WorldLoop_1 = require("./WorldLoop");
class World extends BrokerSchema_1.BrokerSchema {
    constructor() {
        super(...arguments);
        this.PROCESS_NAME = 'World';
    }
    initialize() {
        this.beforeStart(this.createWorldLoopService);
        if (process.env.NODE_ENV !== 'test') {
            console.log("Config:");
            console.log(prettyJson.render(this.config));
            console.log("---\n\n");
            console.log("Broker Schema:");
            console.log(prettyJson.render(this.schema()));
            console.log("---\n");
        }
    }
    createWorldLoopService(broker) {
        broker.createService(new WorldLoop_1.WorldLoop(broker).schema());
    }
}
exports.World = World;
//# sourceMappingURL=World.js.map