"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pkg = require('root-require')('package.json');
const Validator = require("fastest-validator");
class BrokerSchema {
    constructor(config = {}) {
        this.config = {
            redis: 'redis://localhost',
        };
        this.beforeStartHooks = [];
        this.afterStartHooks = [];
        this.beforeStopHooks = [];
        this.afterStopHooks = [];
        this.config = Object.assign({}, this.DEFAULT_CONFIG, this.config, config);
        const validateConfig = new Validator().compile(this.SPortalConfig);
        const validationResult = validateConfig(this.config);
        if (validationResult instanceof Array) {
            console.log('There was an error validating the configuration. See the documentation and correct' +
                ' the following errors:');
            console.log(validationResult);
            process.exit(1);
        }
        if (process.env.NODE_ENV !== 'test') {
            console.log(`Lucid Mud Engine v${pkg.version} - ${this.SERVICE_NAME} Service\n`);
        }
    }
    get SPortalConfig() {
        return {
            redis: { type: 'string', pattern: /redis:\/\/.+/ },
        };
    }
    get SERVICE_NAME() {
        throw Error('Not Implemented');
    }
    get DEFAULT_CONFIG() {
        throw Error('Not Implemented');
    }
    schema() {
        return {
            nodeID: 'lucid-portal',
            logger: true,
            logLevel: 'debug',
            transport: this.config.redis,
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
            broker.logger.debug('running beforeStartHooks');
            this.beforeStartHooks.forEach((f) => f(broker));
        };
    }
}
exports.BrokerSchema = BrokerSchema;
//# sourceMappingURL=BrokerSchema.js.map