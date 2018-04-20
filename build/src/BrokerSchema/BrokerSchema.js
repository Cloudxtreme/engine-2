"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const SchemaBuilder_1 = require("../SchemaBuilder");
const pkg = require('root-require')('package.json');
const Validator = require("fastest-validator");
class BrokerSchema extends SchemaBuilder_1.SchemaBuilder {
    constructor(config = {}) {
        super();
        this.config = {
            redis: 'redis://127.0.0.1:6379',
        };
        this.SPORTAL_CONFIG = {
            redis: { type: 'string', pattern: /redis:\/\/.+/ },
        };
        this.beforeStartHooks = [];
        this.afterStartHooks = [];
        this.beforeStopHooks = [];
        this.afterStopHooks = [];
        this.config = Object.assign({}, this.DEFAULT_CONFIG, this.config, config);
        const validateConfig = new Validator().compile(this.SPORTAL_CONFIG);
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
    schema() {
        return {
            nodeID: `lucid-${lodash.lowerCase(this.SERVICE_NAME)}`,
            logger: true,
            logLevel: 'debug',
            transporter: this.config.redis,
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