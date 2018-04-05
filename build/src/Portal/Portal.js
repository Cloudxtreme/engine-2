"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moleculer_1 = require("moleculer");
const validate_typescript_1 = require("validate-typescript");
var Portal;
(function (Portal) {
    const SPortalConfig = {
        server: validate_typescript_1.RegEx(/tcp:\/\/.+/),
        redis: validate_typescript_1.RegEx(/redis:\/\/.+/),
        logging: {
            file: validate_typescript_1.RegEx(/\/.+/),
            level: validate_typescript_1.Options(['OFF', 'FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE', 'ALL']),
        },
    };
    class Listener {
        constructor(config = {
            redis: 'redis://localhost',
            server: 'tcp://localhost:2323',
            logging: {
                file: '/dev/stdout',
                level: 'DEBUG',
            },
        }) {
            this.beforeStartHooks = [];
            this.afterStartHooks = [];
            try {
                validate_typescript_1.validate(SPortalConfig, config);
            }
            catch (_a) {
                console.log('There was an error validating the configuration. See the documentation and correct' +
                    ' the above errors.');
                process.exit(1);
            }
            this.broker = new moleculer_1.ServiceBroker();
        }
        beforeStart(callback) {
            this.beforeStartHooks.concat(callback);
            return this;
        }
        afterStart(callback) {
            this.afterStartHooks.concat(callback);
            return this;
        }
    }
    Portal.Broker = Listener;
})(Portal = exports.Portal || (exports.Portal = {}));
//# sourceMappingURL=Portal.js.map