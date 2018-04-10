"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prettyJson = require("prettyjson");
const BrokerSchema_1 = require("../BrokerSchema");
const TelnetService_1 = require("./TelnetService");
/**
 * The Portal provides the connection between the player's MUD client and the World.
 */
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
        // set the telnet service to start up after the broker has started
        this.beforeStart((broker) => (broker.createService(new TelnetService_1.TelnetService(this.config))));
        if (process.env.NODE_ENV !== 'test') {
            // tslint:disable
            console.log("Config:");
            console.log(prettyJson.render(this.config));
            console.log("---\n\n");
            console.log("Broker Schema:");
            console.log(prettyJson.render(this.schema()));
            console.log("---\n");
            //tslint:enable
        }
    }
}
exports.Broker = Broker;
//# sourceMappingURL=Broker.js.map