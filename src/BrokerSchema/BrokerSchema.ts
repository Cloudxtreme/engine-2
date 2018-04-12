import * as lodash from 'lodash';
import {ServiceBroker} from 'moleculer';
import {SchemaBuilder} from '../SchemaBuilder';

// tslint:disable-next-line
const pkg = require('root-require')('package.json');
// tslint:disable-next-line
const Validator = require("fastest-validator");

export interface IBrokerConfig {
    /**
     * The Redis server that will be used for brokering the messages to the World. Defaults to `redis://localhost`
     */
    redis: string;
}

/**
 * The BrokerSchema is used to create the core service brokers for the World and Portal services.
 */
export class BrokerSchema extends SchemaBuilder {

    public readonly config: IBrokerConfig = {
        redis: 'redis://127.0.0.1:6379',
    };
    protected readonly SPORTAL_CONFIG: object = {
        redis: {type: 'string', pattern: /redis:\/\/.+/},
    };

    protected readonly SERVICE_NAME: string;
    protected readonly DEFAULT_CONFIG: object;

    private beforeStartHooks: Function[] = [];
    private afterStartHooks: Function[] = [];
    private beforeStopHooks: Function[] = [];
    private afterStopHooks: Function[] = [];

    constructor(config: {} | IBrokerConfig = {}) {
        super();
        this.config = {...<IBrokerConfig>this.DEFAULT_CONFIG, ...this.config, ...config};
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

    public schema() {
        return {
            nodeID: `lucid-${lodash.lowerCase(this.SERVICE_NAME)}`,
            logger: true,
            logLevel: 'debug',
            transporter: this.config.redis,
            created: this.runBeforeStartHooks(),
        };
    }

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
            broker.logger.debug('running beforeStartHooks');
            this.beforeStartHooks.forEach((f: Function) => f(broker));
        };
    }

}
