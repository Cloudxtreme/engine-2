import {SchemaBuilder} from '../SchemaBuilder';
import {
    Actions,
    LoggerInstance,
    ServiceBroker,
    ServiceMethods,
    ServiceSchema as MoleculerServiceSchema
} from 'moleculer';

export interface IServiceSchemaOptions {
    settings?: object;
    metadata?: object;
    actions?: Actions;
    methods?: ServiceMethods;
}

export class ServiceSchema extends SchemaBuilder {
    public broker: ServiceBroker;
    public serviceSettings: object;
    public serviceActions: Actions;
    public serviceMetadata: object;
    public serviceMethods: ServiceMethods;
    public name: string;
    public logger: LoggerInstance;
    public options: IServiceSchemaOptions;

    get actions(): Actions {
        return {};
    }

    get metadata(): object {
        return {};
    }

    get settings(): object {
        return {};
    }

    get methods(): ServiceMethods {
        return {};
    }

    constructor(broker: ServiceBroker, options: IServiceSchemaOptions = {}) {
        super();
        this.options = options;
        this.broker = broker;
        this.serviceActions = {...options.actions, ...this.actions};
        this.serviceMetadata = {...options.metadata, ...this.metadata};
        this.serviceSettings = {...options.settings, ...this.settings};
        this.serviceMethods = {...options.methods, ...this.methods};
    }

    public created(): void {
        return;
    }

    public schema(): MoleculerServiceSchema {
        return {
            name: this.name,
            actions: this.serviceActions,
            settings: this.serviceSettings,
            metadata: this.serviceMetadata,
            methods: this.serviceMethods,
            created: this.created,
        };
    }
}
