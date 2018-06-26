import { dasherize } from "inflection";
import { kebabCase } from "lodash";
import { any, append, assoc, compose, curry, isNil, not, pipe, prop, when } from "ramda";
import * as UUID from "uuid";

export interface IObject {
    uuid: string;
    key: string;
    objectType: string;
    createdAt: string;
    updatedAt: string;
}

export type TObjectFactory = (object: IObject) => IObject;

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
            prop("updatedAt"),
            isNil,
        ),
        assoc("updatedAt", new Date()),
    )(object);
}

function setObjectTypes(object: IObject) {
    return when(
        pipe(
            prop("objectTypes"),
            isNil,
        ),
        assoc("objectTypes", []),
    )(object);
}

const addObjectType = curry(function(objectType: string, object: IObject) {
    return when(
        pipe(
            prop("objectTypes"),
            any,
        ),
        assoc(
            "objectTypes",
            pipe(
                prop("objectTypes"),
                append(objectType),
            )(object),
        ),
    )(object);
});

export const ObjectType = function(objectType: string, ...definition: Function[]): TObjectFactory {
    return pipe(
        pipe(
            when(
                isNil,
                () => {},
            ),
        ),
        assoc("objectType", objectType),
        setObjectTypes,
        addObjectType(objectType),
        setUuid,
        setKey,
        setCreatedAt,
        setUpdatedAt,
        compose(...definition),
    );
};
