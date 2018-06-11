import {
    Actions,
    LoggerInstance,
    Service,
    ServiceBroker,
    ServiceEvents,
    ServiceMethods,
} from "moleculer";

import {
    compose,
    ContainerObjectType,
    IContainerObjectType,
    IServiceObjectType,
    ObjectType,
    ServiceObjectType,
    TObjectContainer,
} from "../";

@compose(
    ContainerObjectType,
    ServiceObjectType,
)
export class WorldObjectType extends ObjectType
    implements IContainerObjectType, IServiceObjectType {
    readonly actions: Actions;
    readonly methods: ServiceMethods;
    readonly events: ServiceEvents;
    readonly objects: TObjectContainer;
    readonly service: Service;
    readonly logger: LoggerInstance;

    created(broker: ServiceBroker) {
        broker.logger.debug("preparing world");
    }

    add(): void {}
    remove(): void {}
    emit(): void {}
    on(): void {}
}
