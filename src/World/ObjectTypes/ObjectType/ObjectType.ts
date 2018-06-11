import * as lodash from "lodash";
import * as uuid from "uuid";

export interface IObjectType {
    uuid: string;
    key: string;
    objectType: string;
    parent: IObjectType;
    initialize?: Function;
}

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
        if (this.initialize) this.initialize(props);
        if (this._initialize) this._initialize.call(this, props);
    }
}

export const compose = (...types: any[]) => {
    return (base: any) => {
        base.traits = {};
        const initializers = [];
        types.forEach((t: any) => {
            Object.getOwnPropertyNames(t.prototype).forEach((name: string) => {
                if (!base.prototype[name] && name !== "constructor") {
                    base.prototype[name] = t.prototype[name];
                } else if (name === "initialize") {
                    initializers.push(t.prototype[name]);
                }
            });
            base.traits[t.name] = t;
        });

        if (initializers.length > 0) {
            // tslint:disable-next-line:no-function-expression
            base.prototype._initialize = function(props: IObjectType) {
                return lodash.flowRight(
                    ...initializers.map((i: Function) => i.bind(this)),
                )(props);
            };
        }

        return base;
    };
};
