import * as lodash from "lodash";

import {
    compose,
    IObjectType,
    ObjectType,
} from "../ObjectType";

import {
    EventedObjectType,
    IEventedObjectType,
} from "../EventedObjectType";

export type TObjectContainer = {
    [key: string]: IObjectType;
};

export interface IContainerObjectType {
    objects: TObjectContainer;
    add: Function;
}

@compose(EventedObjectType)
export class ContainerObjectType extends ObjectType
    implements IContainerObjectType, IEventedObjectType {
    readonly objects: TObjectContainer = {};

    add(pathOrObject: string | IObjectType, object: IObjectType) {
        let parent: IObjectType;
        let objectPath: string;

        if (typeof pathOrObject === "object") {
            parent = this;
            // tslint:disable-next-line:no-parameter-reassignment
            object = pathOrObject;
            objectPath = object.key;
        } else {
            objectPath = `${pathOrObject.replace(".", ".objects.")}`;
            parent = lodash.get(<any>this.objects, objectPath);
            objectPath = `${objectPath}.objects.${object.key}`;
        }
        object.parent = parent;
        lodash.set(<any>this.objects, objectPath, object);
        object.parent.emit("objectAdded", object);
    }

    remove(pathOrObject: string | IObjectType) {
        let object;

        if (typeof pathOrObject === "object") {
            object = pathOrObject;
        } else {
            const objectPath = `${pathOrObject.replace(".", ".objects.")}`;
            object = lodash.get(this.objects, <any>objectPath);
        }

        object.parent.emit("objectRemoved", object);
        delete object.parent.objects[object.key];
    }

    on(): void {}
    emit(): void {}
}
