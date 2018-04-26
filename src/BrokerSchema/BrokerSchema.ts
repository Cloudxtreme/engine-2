import * as lodash from 'lodash';
import {BrokerOptions, LoggerInstance, ServiceBroker} from 'moleculer';

import {SchemaBuilder} from '../SchemaBuilder';

export interface IBrokerConfig {
    /**
     * The Redis server that will be used for brokering the messages to the World. Defaults to `redis://localhost`
     */
    redis: string;
}

/**
 * The BrokerSchema class is used to build the Moleculer schemas for the World and Portal processes.
 */
export abstract class BrokerSchema extends SchemaBuilder {

    /**
     * The name of the process. This is used to name the World and Portal processes, and thereby to set the `nodeId`
     * of the Moleculer broker.
     */
    protected readonly PROCESS_NAME: string;

    /**
     * The default configuration for the broker. This is set to whatever defaults the particular broker requires, and
     * is merged with any configuration passed into the broker from it's respective configuration file.
     */
    protected readonly DEFAULT_CONFIG: object;

    /**
     * Broker configuration.
     * @type {{redis: string}} the redis url host to connect to. This must be the same in both the World and Portal
     * processes
     */
    protected readonly config: IBrokerConfig = {
        redis: 'redis://127.0.0.1:6379',
    };
    protected readonly logger: LoggerInstance;

    private beforeStartHooks: Function[] = [];
    private afterStartHooks: Function[] = [];
    private beforeStopHooks: Function[] = [];

    /**
     * @param {{} | IBrokerConfig} config configuration to override the configuration defaults.
     */
    constructor(config: {} | IBrokerConfig = {}) {
        super();
        this.config = {...<IBrokerConfig>this.DEFAULT_CONFIG, ...this.config, ...config};
        this.initialize();
    }

    public schema(): BrokerOptions {
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

    /**
     * Add a beforeStart hook. These hooks are called after the process service broker is created, but before it
     * starts.
     * @param {Function} callback
     * @returns {BrokerSchema} returns `this`
     */
    public beforeStart(callback: Function): BrokerSchema {
        this.beforeStartHooks.push(callback);

        return this;
    }

    /**
     * Add an afterStart hook. These hooks are called after the process service broker is started.
     * @param {Function} callback
     * @returns {BrokerSchema} returns `this`
     */
    public afterStart(callback: Function): BrokerSchema {
        this.afterStartHooks.push(callback);

        return this;
    }

    /**
     * Add an beforeStop hook. These hooks are called before the process service broker is stopped.
     * @param {Function} callback
     * @returns {BrokerSchema} returns `this`
     */
    public beforeStop(callback: Function): BrokerSchema {
        this.beforeStopHooks.push(callback);

        return this;
    }

    /**
     * allows for adding custom initialization code.
     */
    protected initialize(): void {
        return;
    }

    private runBeforeStartHooks(): (broker: ServiceBroker) => void {
        return (broker: ServiceBroker): void => {
            broker.logger.debug('running beforeStartHooks');
            this.beforeStartHooks.forEach((f: Function) => {
                return f.bind(this)(broker);
            });
        };
    }

    private runAfterStartHooks(): (broker: ServiceBroker) => void {
        return (broker: ServiceBroker): void => {
            broker.logger.debug('running afterStartHooks');
            this.afterStartHooks.forEach((f: Function) => {
                return f.bind(this)(broker);
            });
        };
    }

    private runBeforeStopHooks(): (broker: ServiceBroker) => void {
        return (broker: ServiceBroker): void => {
            broker.logger.debug('running afterStartHooks');
            this.beforeStopHooks.forEach((f: Function) => {
                return f.bind(this)(broker);
            });
        };
    }
}
