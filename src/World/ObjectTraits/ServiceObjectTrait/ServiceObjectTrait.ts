import {
    Actions,
    LoggerInstance,
    Service,
    ServiceEvents,
    ServiceMethods,
} from "moleculer";

import { TConstructor } from "../";
import { IObjectType } from "../../ObjectTypes";

export interface IServiceObject {
    methods: ServiceMethods;
    actions: Actions;
    events: ServiceEvents;
    service: Service;
    logger: LoggerInstance;
    created?: Function;
    started?: Function;
}

// tslint:disable-next-line:function-name
export function ServiceObjectTrait<TBase extends TConstructor>(Base: TBase) {
    return class extends Base implements IServiceObject {
        readonly methods: ServiceMethods = {};
        readonly actions: Actions = {};
        readonly events: ServiceEvents = {};
        readonly service: Service;
        readonly logger: LoggerInstance;

        constructor(traits: IObjectType) {
            super(traits);
            this.service = global.broker.createService(
                this._serviceDefinition(),
            );
            this.logger = this.service.logger;
        }

        // tslint:disable-next-line:no-empty
        created(): void {}

        // tslint:disable-next-line:no-empty
        started(): void {}

        // tslint:disable-next-line:function-name
        private _serviceDefinition() {
            return {
                name: this.key,
                methods: { ...{}, ...this.methods },
                actions: { ...{}, ...this.actions },
                events: { ...{}, ...this.events },
                created: this.created,
                started: this.started,
            };
        }
    };
}
