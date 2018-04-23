import {
    Actions,
    GenericObject,
    LoggerInstance,
    ServiceBroker,
    ServiceEvents,
    ServiceMethods,
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
    protected readonly logger: LoggerInstance;

    constructor(broker: ServiceBroker, config: IServiceSchemaOptions = {}) {
        super();
        const {settings, metadata} = config;
        this.logger = broker.logger;
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
        };
    }
}
