"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prettyJson = require("prettyjson");
const BrokerSchema_1 = require("../BrokerSchema");
const TelnetService_1 = require("./TelnetService");
class Portal extends BrokerSchema_1.BrokerSchema {
    constructor(config = {}) {
        super(config);
        this.PROCESS_NAME = 'Portal';
        this.beforeStart(this.createTelnetService());
        if (process.env.NODE_ENV !== 'test') {
            console.log("Config:");
            console.log(prettyJson.render(this.config));
            console.log("---\n\n");
            console.log("Broker Schema:");
            console.log(prettyJson.render(this.schema()));
            console.log("---\n");
        }
    }
    get DEFAULT_CONFIG() {
        return {
            host: 'tcp://0.0.0.0:2323',
        };
    }
    createTelnetService() {
        const config = this.config;
        return (broker) => {
            return broker.createService(new TelnetService_1.TelnetService(broker, { settings: config }).schema());
        };
    }
}
exports.Portal = Portal;
//# sourceMappingURL=Portal.js.map