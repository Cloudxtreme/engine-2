import { append, assoc, defaultTo, compose, curry, isNil, pipe, prop, when } from "ramda";

import { IObject, ObjectType } from "../ObjectType";

export interface IServiceObject extends IObject {
    events: TEventHandlers;
}

type TEventHandlers = {
    [key: string]: string[];
};

export const addEventHandler = curry(function(name: string, script: string, object: IServiceObject) {
    return pipe(
        assoc("events", pipe(
            pipe(
                prop("events"),
                defaultTo({}),
            ),
            assoc(name, script),
        )(object)),
    )(object);
});

export const ServiceObjectType = function(object: IServiceObject | {} = {}): IServiceObject {
    return <IServiceObject>ObjectType("ServiceObject")(<IServiceObject>object);
};


