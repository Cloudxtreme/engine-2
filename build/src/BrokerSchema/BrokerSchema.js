"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const SchemaBuilder_1 = require("../SchemaBuilder");
class BrokerSchema extends SchemaBuilder_1.SchemaBuilder {
    constructor(config = {}) {
        super();
        this.CONFIG = {
            redis: 'redis://127.0.0.1:6379',
        };
        this.beforeStartHooks = [];
        this.afterStartHooks = [];
        this.beforeStopHooks = [];
        this.CONFIG = Object.assign({}, this.DEFAULT_CONFIG, this.config, config);
        this.initialize();
    }
    get config() {
        return this.CONFIG;
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
    initialize() {
        return;
    }
    runBeforeStartHooks() {
        return (broker) => {
            broker.logger.debug('running beforeStartHooks');
            this.beforeStartHooks.forEach((f) => {
                return f.bind(this)(broker);
            });
        };
    }
    runAfterStartHooks() {
        return (broker) => {
            broker.logger.debug('running afterStartHooks');
            this.afterStartHooks.forEach((f) => {
                return f.bind(this)(broker);
            });
        };
    }
    runBeforeStopHooks() {
        return (broker) => {
            broker.logger.debug('running afterStartHooks');
            this.beforeStopHooks.forEach((f) => {
                return f.bind(this)(broker);
            });
        };
    }
}
exports.BrokerSchema = BrokerSchema;
//# sourceMappingURL=BrokerSchema.js.map