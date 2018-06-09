import { Actions, ServiceEvents, ServiceMethods } from "moleculer";

import { TConstructor } from "../";
import { IObjectType } from "../../ObjectTypes";

// tslint:disable-next-line:function-name
export function ServiceObjectTrait<TBase extends TConstructor>(Base: TBase) {
    return class extends Base {
        methods: ServiceMethods = {};
        actions: Actions = {};
        events: ServiceEvents = {};

        constructor(traits: IObjectType) {
            super(traits);
            global.broker.createService(this._serviceDefinition());
        }

        // tslint:disable-next-line:no-empty
        created(): void {}

        // tslint:disable-next-line:no-empty
        started(): void {}

        // tslint:disable-next-line:function-name
        _serviceDefinition() {
            return {
                name: this.key,
                methods: this.methods,
                actions: this.actions,
                events: this.events,
                created: function() {
                    this.created.apply(this);
                },
                started: function() {
                    this.started.apply(this);
                },
            };
        }
    };
}
