import * as Bluebird from 'bluebird';
import {
    Actions,
    GenericObject,
    LoggerInstance,
    ServiceBroker,
    ServiceEvents,
    ServiceMethods,
    ServiceSchema as MoleculerServiceSchema,
    ServiceSettingSchema,
} from 'moleculer';

import {SchemaBuilder} from '../SchemaBuilder';

export interface IServiceSchemaOptions {
    metadata?: GenericObject;
    settings?: ServiceSettingSchema;
}

/**
 * The ServiceSchema class acts as as a base class for services that are registered by the Portal and World brokers.
 */
export abstract class ServiceSchema extends SchemaBuilder {
    protected readonly name: string;
    protected settings: ServiceSettingSchema = {};
    protected metadata: GenericObject = {};
    protected readonly actions: Actions = {};
    protected readonly events: ServiceEvents = {};
    protected readonly methods: ServiceMethods = {};
    protected logger: LoggerInstance;
    protected readonly broker: ServiceBroker;
    protected readonly dependencies: GenericObject | String[] | GenericObject[];

    constructor(broker: ServiceBroker, config: IServiceSchemaOptions = {}) {
        super();
        const {settings, metadata} = config;
        this.logger = broker.logger;
        this.broker = broker;
        this.settings = {...settings, ...this.settings};
        this.metadata = {...metadata, ...this.metadata};
    }

    public schema(): MoleculerServiceSchema {
        return {
            actions: this.actions,
            settings: this.settings,
            name: this.name,
            events: this.events,
            methods: this.methods,
            metadata: this.metadata,
            created: this.created,
            started: this.started,
            stopped: this.stopped,
            dependencies: this.dependencies,
        };
    }

    protected created(): void {
        return;
    }

    protected started(): Bluebird<void> {
        return new Promise((resolve: Function) => resolve());
    }

    protected stopped(): Bluebird<void> {
        return new Promise((resolve: Function) => resolve());
    }
}
