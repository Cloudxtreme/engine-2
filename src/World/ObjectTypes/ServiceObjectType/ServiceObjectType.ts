import {
    Actions,
    LoggerInstance,
    Service,
    ServiceEvents,
    ServiceMethods,
} from "moleculer";

import { IObjectType, ObjectType } from "../ObjectType";

export interface IServiceObjectType {
    methods: ServiceMethods;
    actions: Actions;
    events: ServiceEvents;
    service: Service;
    logger: LoggerInstance;
    created?: Function;
    started?: Function;
}

export class ServiceObjectType extends ObjectType
    implements IServiceObjectType {
    readonly methods: ServiceMethods = {};
    readonly actions: Actions = {};
    readonly events: ServiceEvents = {};
    readonly service: Service;
    readonly logger: LoggerInstance;

    initialize(props: IObjectType) {
        this.service = global.broker.createService(this._serviceDefinition());
        this.logger = this.service.logger;
    }

    // tslint:disable-next-line:function-name
    private _serviceDefinition() {
        return {
            name: this.key,
            methods: { ...{}, ...this.methods },
            actions: { ...{}, ...this.actions },
            events: { ...{}, ...this.events },
            created: this.created,
            started: this.started,
            objectTypeDefinition: this,
        };
    }
}
