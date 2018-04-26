"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prettyJson = require("prettyjson");
const BrokerSchema_1 = require("../BrokerSchema");
class World extends BrokerSchema_1.BrokerSchema {
    constructor() {
        super(...arguments);
        this.PROCESS_NAME = 'World';
    }
    initialize() {
        if (process.env.NODE_ENV !== 'test') {
            console.log("Config:");
            console.log(prettyJson.render(this.config));
            console.log("---\n\n");
            console.log("Broker Schema:");
            console.log(prettyJson.render(this.schema()));
            console.log("---\n");
        }
    }
}
exports.World = World;
//# sourceMappingURL=World.js.map