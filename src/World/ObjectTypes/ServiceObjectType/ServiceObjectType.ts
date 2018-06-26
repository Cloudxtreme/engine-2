import { ServiceEvents } from "moleculer";
import { assoc, compose, curry, isNil, pipe, prop, when } from "ramda";

import { IObject, ObjectType } from "../ObjectType";

export interface IServiceObject extends IObject {
}

export const ServiceObjectType = function(object: IServiceObject | {} = {}): IServiceObject {
    return <IServiceObject>ObjectType("ServiceObject")(<IServiceObject>object);
};
