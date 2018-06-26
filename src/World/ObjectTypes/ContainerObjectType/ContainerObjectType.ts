import { includes } from "lodash";
import { any, assoc, assocPath, curry, isNil, not, pipe, prop, when } from "ramda";

import { IObject, ObjectType } from "../ObjectType";

interface IContainerObject extends IObject {
    children: IObject[];
}

export const addObject = curry(function(object: IObject, target: IContainerObject) {
    if (!includes("ContainerObject", target.objectTypes)) throw new Error("Object is not of type 'ContainerObject'");

    return assocPath(["children", target.key], target)(object);
});

function setChildren(object: IContainerObject): IContainerObject {
    return when(
        pipe(
            prop("children"),
            isNil,
        ),
        assoc("children", {}),
    )(object);
}

export const ContainerObjectType = function(object: IContainerObject | {} = {}): IContainerObject {
    return <IContainerObject>ObjectType("ContainerObject", setChildren)(<IContainerObject>object);
};
