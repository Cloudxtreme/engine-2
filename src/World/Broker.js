"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prettyJson = require("prettyjson");
const BrokerSchema_1 = require("../BrokerSchema");
const NewSessionService_1 = require("./NewSessionService");
/**
 * The Portal provides the connection between the player's MUD client and the World.
 */
class Broker extends BrokerSchema_1.BrokerSchema {
    constructor(config = {}) {
        super(config);
        this.DEFAULT_CONFIG = {};
        this.beforeStart((broker) => (broker.createService(new NewSessionService_1.NewSessionService(broker).schema())));
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
    get SERVICE_NAME() {
        return 'World';
    }
}
exports.Broker = Broker;
//# sourceMappingURL=Broker.js.map