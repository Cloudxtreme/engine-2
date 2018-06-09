import { ObjectType } from "../ObjectType";

import { ContainerObjectTrait, ServiceObjectTrait } from "../../ObjectTraits";

@types(ContainerObjectTrait, ServiceObjectTrait)
export class WorldObjectType extends ObjectType {
    readonly key: string = "world";
}
