"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pkg = require('root-require')('package.json');
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
    class SchemaFactory {
        constructor(config = {}) {
            this.beforeStartHooks = [];
            this.afterStartHooks = [];
            this.beforeStopHooks = [];
            this.afterStopHooks = [];
            this.config = {
                redis: 'redis://localhost',
                server: 'tcp://localhost:2323',
                logging: {
                    file: '/dev/stdout',
                    level: 'DEBUG',
                },
            };
            this.config = Object.assign({}, this.config, config);
            try {
                validate_typescript_1.validate(SPortalConfig, this.config);
            }
            catch (_a) {
                console.log('There was an error validating the configuration. See the documentation and correct' +
                    ' the above errors.');
                process.exit(1);
            }
        }
        schema() {
            console.log(`Lucid Mud Engine v${pkg.version} - Portal Service\n`);
            return {
                created: this.runBeforeStartHooks(),
            };
        }
        beforeStart(callback) {
            this.beforeStartHooks.push(callback);
            return this;
        }
        afterStart(callback) {
            this.afterStartHooks.push(callback);
            return this;
        }
        afterStop(callback) {
            this.afterStopHooks.push(callback);
            return this;
        }
        beforeStop(callback) {
            this.beforeStartHooks.push(callback);
            return this;
        }
        runBeforeStartHooks() {
            return (broker) => {
                this.beforeStartHooks.forEach((f) => f(broker));
            };
        }
    }
    Portal.Broker = SchemaFactory;
})(Portal = exports.Portal || (exports.Portal = {}));
//# sourceMappingURL=Broker.js.map