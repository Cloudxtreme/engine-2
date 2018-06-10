import * as lodash from "lodash";

import { EventEmitterObjectTrait, TConstructor } from "../";
import { IObjectType, traits } from "../../ObjectTypes";

export type TObjectContainer = {
    [key: string]: IObjectType;
};

export interface IContainerObject {
    objects: TObjectContainer;
    add: Function;
}

// tslint:disable-next-line
let ContainerObjectTrait = function<TBase extends TConstructor>(Base: TBase) {
    return class extends Base implements IContainerObject {
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
    };
};

ContainerObjectTrait = traits(EventEmitterObjectTrait, ContainerObjectTrait);

export { ContainerObjectTrait };
