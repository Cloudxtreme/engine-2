import fastestValidator from 'fastest-validator';
import {BrokerOptions, ServiceBroker} from 'moleculer';
import {validate} from 'validate-typescript';

// tslint:disable-next-line
const pkg = require('root-require')('package.json');

export interface IBrokerConfig {
    /**
     * The Redis server that will be used for brokering the messages to the World. Defaults to `redis://localhost`
     */
    redis: string;
}

export class BrokerSchema {

    // tslint:disable-next-line:variable-name
    get SPortalConfig() {
        return {
            redis: {type: 'string', pattern: /redis:\/\/.+/},
        };
    }

    get SERVICE_NAME(): Error | String {
        throw Error('Not Implemented');
    }

    private readonly config: {} | IBrokerConfig = {
        redis: 'redis://localhost',
    };
    private beforeStartHooks: Function[] = [];
    private afterStartHooks: Function[] = [];
    private beforeStopHooks: Function[] = [];
    private afterStopHooks: Function[] = [];

    /**
     * @param {Portal.IPortalConfig} config Portal configuration
     */
    constructor(config: {} | IBrokerConfig = {}) {
        this.config = {...this.config, ...config};
        const validateConfig = new fastestValidator().compile(this.SPortalConfig);
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

    public schema() {
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
    public beforeStart(callback: Function): BrokerSchema {
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
    public afterStart(callback: Function): BrokerSchema {
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
    public afterStop(callback: Function): BrokerSchema {
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
    public beforeStop(callback: Function): BrokerSchema {
        this.beforeStartHooks.push(callback);

        return this;
    }

    private runBeforeStartHooks(): Function {
        return (broker: ServiceBroker) => {
            this.beforeStartHooks.forEach((f: Function) => f(broker));
        };
    }

}