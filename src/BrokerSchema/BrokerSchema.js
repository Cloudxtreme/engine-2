"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
// tslint:disable-next-line
const pkg = require('root-require')('package.json');
// tslint:disable-next-line
const Validator = require("fastest-validator");
class BrokerSchema {
    /**
     * @param {Portal.IPortalConfig} config Portal configuration
     */
    constructor(config = {}) {
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
            // tslint:disable-next-line:no-console
            console.log('There was an error validating the configuration. See the documentation and correct' +
                ' the following errors:');
            // tslint:disable-next-line:no-console
            console.log(validationResult);
            process.exit(1);
        }
        if (process.env.NODE_ENV !== 'test') {
            // tslint:disable-next-line:no-console
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
    /**
     * Add a beforeStart hook. These hooks are called before the Portal's service broker starts. This is useful for
     * making connections to external resources that will be required by the Portal to operate. This can be called
     * multiple times, and hooks will be called in the order they are defined.
     * @param {Function} callback the callback to call before the service starts
     * @returns {Portal.Broker}
     *
     * @example
     * ```typescript
     *    portal
     *      .beforeStart(function() {
     *          // ..do things
     *      })
     *      .beforeStart(function() {
     *        // .. do more things
     *      })
     *  ```
     */
    beforeStart(callback) {
        this.beforeStartHooks.push(callback);
        return this;
    }
    /**
     * Add an afterStart hook. These hooks are called after the Portal's service broker starts.
     * @param {Function} callback the callback to call after the service starts
     * @returns {Portal.Broker}
     *
     * @example
     * ```typescript
     *    portal
     *      .afterStart(function() {
     *          // ..do things
     *      })
     *      .afterStart(function() {
     *        // .. do more things
     *      })
     *  ```
     */
    afterStart(callback) {
        this.afterStartHooks.push(callback);
        return this;
    }
    /**
     * Add an afterStop hook. These hooks are called after the Portal's service broker stops.
     * @param {Function} callback the callback to call after the service starts
     * @returns {Portal.Broker}
     *
     * @example
     * ```typescript
     *    portal
     *      .afterStop(function() {
     *          // ..do things
     *      })
     *      .afterStop(function() {
     *        // .. do more things
     *      })
     *  ```
     */
    afterStop(callback) {
        this.afterStopHooks.push(callback);
        return this;
    }
    /**
     * Add a beforeStop hook. These hooks are called before the Portal's service broker stops.
     * @param {Function} callback the callback to call before the service stops
     * @returns {Portal.Broker}
     *
     * @example
     * ```typescript
     *    portal
     *      .beforeStop(function() {
     *          // ..do things
     *      })
     *      .beforeStop(function() {
     *        // .. do more things
     *      })
     *  ```
     */
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