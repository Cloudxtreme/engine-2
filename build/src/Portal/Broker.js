"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prettyJson = require("prettyjson");
const BrokerSchema_1 = require("../BrokerSchema");
const TelnetService_1 = require("./TelnetService");
class Broker extends BrokerSchema_1.BrokerSchema {
    get DEFAULT_CONFIG() {
        return {
            host: 'tcp://0.0.0.0:2323',
        };
    }
    get SERVICE_NAME() {
        return 'Portal';
    }
    constructor(config = {}) {
        super(config);
        this.beforeStart((broker) => (broker.createService(new TelnetService_1.TelnetService(broker, { settings: this.config }).schema())));
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
exports.Broker = Broker;
//# sourceMappingURL=Broker.js.map