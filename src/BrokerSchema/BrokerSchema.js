"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastest_validator_1 = require("fastest-validator");
// tslint:disable-next-line
const pkg = require('root-require')('package.json');
class BrokerSchema {
    /**
     * @param {Portal.IPortalConfig} config Portal configuration
     */
    constructor(config = {}) {
        this.config = {
            redis: 'redis://localhost',
        };
        this.beforeStartHooks = [];
        this.afterStartHooks = [];
        this.beforeStopHooks = [];
        this.afterStopHooks = [];
        this.config = Object.assign({}, this.config, config);
        const validateConfig = new fastest_validator_1.default().compile(this.SPortalConfig);
        const validationRusult = validateConfig(this.config);
        if (validationRusult instanceof Array) {
            // tslint:disable-next-line:no-console
            console.log('There was an error validating the configuration. See the documentation and correct' +
                ' the following errors:');
            // tslint:disable-next-line:no-console
            console.log(validationRusult);
            process.exit(1);
        }
    }
    // tslint:disable-next-line:variable-name
    get SPortalConfig() {
        return {
            redis: { type: 'string', pattern: /redis:\/\/.+/ },
        };
    }
    get SERVICE_NAME() {
        throw Error('Not Implemented');
    }
    schema() {
        // tslint:disable-next-line:no-console
        console.log(`Lucid Mud Engine v${pkg.version} - ${this.SERVICE_NAME} Service\n`);
        return {
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
            this.beforeStartHooks.forEach((f) => f(broker));
        };
    }
}
exports.BrokerSchema = BrokerSchema;
//# sourceMappingURL=BrokerSchema.js.map