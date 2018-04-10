import {LoggerInstance, ServiceBroker, ServiceSchema as MoleculerServiceSchema} from 'moleculer';

export class ServiceSchema implements MoleculerServiceSchema {
    public  name: string;
    public readonly broker: ServiceBroker;
    public settings: object;
    protected readonly logger: LoggerInstance;
    protected readonly schema: ServiceSchema = this;
}