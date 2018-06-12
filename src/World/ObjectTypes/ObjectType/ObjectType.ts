import * as lodash from "lodash";
import * as uuid from "uuid";
import * as validate from "validate.js";

export interface IObjectType {
    uuid: string;
    key: string;
    objectType: string;
    parent: IObjectType;
    initialize?: Function;
}

export type TObjectConstraints = {
    [key: string]: TObjectConstraint;
};

type TObjectConstraint = {
    presence?: true;
};

export abstract class ObjectType implements IObjectType {
    static readonly schema: TObjectConstraints = {
        uuid: {
            presence: true,
        },
        key: {
            presence: true,
        },
        objectType: {
            presence: true,
        },
    };

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
        if (this._initialize) this._initialize.call(this, props);
        if (this.initialize) this.initialize(props);
    }

    serialize() {
        return validate.cleanAttributes(this, this.constructor.schema);
    }
}

export const compose = (...types: any[]) => {
    return (base: any) => {
        base.traits = {};
        const initializers = [];
        const serializers = [];
        types.forEach((t: any) => {
            Object.getOwnPropertyNames(t.prototype).forEach((name: string) => {
                if (!base.prototype[name] && name !== "constructor") {
                    base.prototype[name] = t.prototype[name];
                } else if (name === "initialize") {
                    initializers.push(t.prototype[name]);
                }
            });
            base.traits[t.name] = t;
            if (t.schema) {
                base.schema = lodash.merge({
                    ...{},
                    ...t.schema,
                    ...base.schema,
                    ...ObjectType.schema,
                });
            }
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
