import { ContainerObjectType, IContainerObject } from "../ContainerObjectType";
import { IObject, ObjectType } from "../ObjectType";
import { IServiceObject, ServiceObjectType } from "../ServiceObjectType";

export interface IWorldObject extends IObject, IContainerObject, IServiceObject {

}

export const WorldObjectType = function(object: IWorldObject | {} = {}): IContainerObject {
    return <IWorldObject>ObjectType("WorldObject", ContainerObjectType, ServiceObjectType)(<IWorldObject>object);
};
