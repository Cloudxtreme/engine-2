import * as lodash from "lodash";
import * as uuid from "uuid";

export interface IObjectType {
    uuid: string;
    key: string;
    objectType: string;
    parent: IObjectType;
}

export type TConstructor<T = {}> = new (...args: any[]) => T;

export abstract class ObjectType implements IObjectType {
    readonly uuid: string;
    readonly key: string;
    readonly objectType: string;
    parent: ObjectType;

    constructor(props: IObjectType | {} = <IObjectType>{}) {
        this.uuid = props.uuid;
        if (!this.uuid) this.uuid = uuid.v1();
        this.objectType = this.constructor.name;
        this.key = props.key;
        if (!this.key) {
            this.key = `${lodash.kebabCase(
                this.objectType.replace("ObjectType", ""),
            )}:${this.uuid.slice(-5, -1)}`;
        }
    }

}

export const traits = (...types: any[]) => {
    return lodash.flowRight(...types);
};
