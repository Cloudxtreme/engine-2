"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prettyJson = require("prettyjson");
const BrokerSchema_1 = require("../BrokerSchema");
const SessionService_1 = require("./SessionService");
class Broker extends BrokerSchema_1.BrokerSchema {
    constructor(config = {}) {
        super(config);
        this.DEFAULT_CONFIG = {};
        this.beforeStart((broker) => (broker.createService(new SessionService_1.SessionService(broker).schema())));
        if (process.env.NODE_ENV !== 'test') {
            console.log("Config:");
            console.log(prettyJson.render(this.config));
            console.log("---\n\n");
            console.log("Broker Schema:");
            console.log(prettyJson.render(this.schema()));
            console.log("---\n");
        }
    }
    get SERVICE_NAME() {
        return 'World';
    }
}
exports.Broker = Broker;
//# sourceMappingURL=Broker.js.map