import {
    Actions,
    LoggerInstance,
    Service,
    ServiceEvents,
    ServiceMethods,
} from "moleculer";

import {
    ContainerObjectTrait,
    IContainerObject,
    IServiceObject,
    ServiceObjectTrait,
    TObjectContainer,
} from "../../ObjectTraits";
import { ObjectType, traits } from "../ObjectType";

@traits(ContainerObjectTrait, ServiceObjectTrait)
export class WorldObjectType extends ObjectType
    implements IServiceObject, IContainerObject {
    readonly actions: Actions;
    readonly methods: ServiceMethods;
    readonly events: ServiceEvents;
    readonly logger: LoggerInstance;
    readonly service: Service;
    readonly objects: TObjectContainer;

    readonly key: string = "world";

    add: () => void;
}
