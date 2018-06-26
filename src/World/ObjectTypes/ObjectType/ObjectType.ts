import { dasherize } from "inflection";
import { assoc, compose, curry, defaultTo, either, evolve, isNil, map, pipe, prop, when } from "ramda";
import { kebabCase } from "lodash";
import * as UUID from "uuid";

interface IObject {
    uuid: string;
    key: string;
    objectType: string;
    createdAt: string;
    updatedAt: string;
}

type TObjectFactory = (object: IObject) => IObject;

function setUuid(object: IObject): IObject {
    return when(
        pipe(
            prop("uuid"),
            isNil,
        ),
        assoc("uuid", UUID.v1()),
    )(object);
}

function setKey(object: IObject): IObject {
    return when(
        pipe(
            prop("key"),
            isNil,
        ),
        assoc("key", `${kebabCase(object.objectType)}:${object.uuid.slice(-5)}`),
    )(object);
}

function setCreatedAt(object: IObject): IObject {
    return when(
        pipe(
            prop("createdAt"),
            isNil,
        ),
        assoc("createdAt", new Date()),
    )(object);
}

function setUpdatedAt(object: IObject): IObject {
    return when(
        pipe(
            prop("createdAt"),
            isNil,
        ),
        assoc("updatedAt", new Date()),
    )(object);
}

export const ObjectType = function(objectType: string, ...definition: Function[]): TObjectFactory {
    return compose(
        setCreatedAt,
        setUpdatedAt,
        setKey,
        setUuid,
        assoc("objectType", objectType),
        ...definition,
    );
};
