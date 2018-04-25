"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const SchemaBuilder_1 = require("../SchemaBuilder");
class BrokerSchema extends SchemaBuilder_1.SchemaBuilder {
    constructor(config = {}) {
        super();
        this.config = {
            redis: 'redis://127.0.0.1:6379',
        };
        this.beforeStartHooks = [];
        this.afterStartHooks = [];
        this.beforeStopHooks = [];
        this.config = Object.assign({}, this.DEFAULT_CONFIG, this.config, config);
    }
    schema() {
        return {
            nodeID: `lucid-${lodash.lowerCase(this.PROCESS_NAME)}`,
            logger: true,
            logLevel: 'debug',
            transporter: this.config.redis,
            created: this.runBeforeStartHooks(),
            started: this.runAfterStartHooks(),
            stopped: this.runBeforeStopHooks(),
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
    beforeStop(callback) {
        this.beforeStopHooks.push(callback);
        return this;
    }
    runBeforeStartHooks() {
        return (broker) => {
            broker.logger.debug('running beforeStartHooks');
            this.beforeStartHooks.forEach((f) => f(broker));
        };
    }
    runAfterStartHooks() {
        return (broker) => {
            broker.logger.debug('running afterStartHooks');
            this.afterStartHooks.forEach((f) => f(broker));
        };
    }
    runBeforeStopHooks() {
        return (broker) => {
            broker.logger.debug('running afterStartHooks');
            this.beforeStopHooks.forEach((f) => f(broker));
        };
    }
}
exports.BrokerSchema = BrokerSchema;
//# sourceMappingURL=BrokerSchema.js.map