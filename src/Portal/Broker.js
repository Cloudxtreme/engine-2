"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BrokerSchema_1 = require("../BrokerSchema");
/**
 * The Portal provides the connection between the player's MUD client and the World.
 */
var Portal;
(function (Portal) {
    class Broker extends BrokerSchema_1.BrokerSchema {
        get SERVICE_NAME() {
            return 'Portal';
        }
    }
    Portal.Broker = Broker;
})(Portal = exports.Portal || (exports.Portal = {}));
//# sourceMappingURL=Broker.js.map