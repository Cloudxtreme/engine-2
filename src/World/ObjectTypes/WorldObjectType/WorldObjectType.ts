import {
    Actions,
    LoggerInstance,
    Service,
    ServiceBroker,
    ServiceEvents,
    ServiceMethods,
} from "moleculer";

import {
    ContainerObjectType,
    IContainerObjectType,
    TObjectContainer,
} from "../ContainerObjectType";
import { compose, ObjectType } from "../ObjectType";
import { IServiceObjectType, ServiceObjectType } from "../ServiceObjectType";

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

    initialize() {
        this.key = "world";
    }

    created() {
        this.logger.debug("preparing world");
    }

    add(): void {}
    remove(): void {}
    emit(): void {}
    on(): void {}
}
