import * as lodash from "lodash";
import * as uuid from "uuid";

export interface IObjectType {
    uuid: string;
    key: string;
    objectType: string;
    parent: IObjectType;
}

type TTraitList = {
    [key: string]: any;
};

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
        const traits = this.constructor.traits;
        // tslint:disable-next-line:no-this-assignment
        const that = this;
        lodash.keys(traits).forEach((name: string) => {
            const newProps = new traits[name](props);
            lodash.keys(newProps).forEach((k: string) => {
                if (!that[k]) that[k] = newProps[k];
            });
        });
    }
}

export const compose = (...types: any[]) => {
    return (base: any) => {
        base.traits = {};
        types.forEach((t: any) => {
            Object.getOwnPropertyNames(t).forEach((name: string) => {
                if (!base.prototype[name] && name !== "constructor") {
                    base.prototype[name] = t.prototype[name];
                }
            });
            base.traits[t.name] = t;
        });

        return base;
    };
};
