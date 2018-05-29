import * as Bluebird from 'bluebird';
import * as lodash from 'lodash';
import * as uuid from 'uuid';
import * as validate from 'validate.js';

export interface IObjectSchema {
    [key: string]: IObjectConstraints;
}

interface IObjectConstraints {
    presence?: boolean;
    unique?: {
        validator: Function;
        errorMessage: string;
    };
    format?: RegExp;
    validateObjectType?: boolean | string;
}

export interface IObjectType {
    uuid: string;
    key: string;
    objectType: string;
    createdAt: Date;
    updatedAt: Date;
    schema: IObjectSchema;
    beforeValidate: IObjectBuilder;
}

export interface IObjectArgs {
    key?: string;
    uuid?: string;
    objectType?: string;
    createdAt?: Date;
    updatedAt?: Date;
    schema?: IObjectSchema;
    beforeValidate?: IObjectBuilder;
}

export type IObjectBuilder = (props: IObjectArgs) => Bluebird<IObjectType>;
export type IBasicObjectBuilder = (props: IObjectArgs) => IObjectType;

export interface IObjectSet {
    [key: string]: IObjectType;
}

const ObjectSchema: IObjectSchema = {
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

const validateObject = (object: IObjectType, schema: IObjectSchema): Bluebird<Object> => {
    return new Promise((resolve: (value: any) => any, reject: (reason: any) => any) => {
        return validate.async(object, schema, {cleanAttributes: false})
            .then(
                resolve,
                reject,
            );
    });
};

validate.validators.objectType = (value: IObjectType | IObjectType[] | IObjectSet, options: boolean | string) => {
    return new Promise((resolve: Function, reject: Function) => {
        if (!value) return resolve();
        if (options === true) {
            const t = <IObjectType>value;

            return validateObject(t, t.schema)
                .then(() => resolve())
                .catch((e: Error) => resolve(e));
        } else if (options === 'array') {
            const t = <IObjectType[]>value;

            return Bluebird.all(t.map((v: IObjectType) => (validateObject(v, v.schema))))
                .then(() => resolve())
                .catch((e: any) => resolve(e));
        } else if (options === 'object') {
            const t = <IObjectSet>value;

            return Bluebird.all(lodash.values(t).map((v: IObjectType) => (validateObject(v, v.schema))))
                .then(() => resolve())
                .catch((e: any) => resolve(e));
        } else {
            return reject('invalid option');
        }
    });
};

/**
 * ObjectType is the base type from which all other objects are derived. World objects are never created from
 * ObjectType, but instead are created with the various extensions of this type.
 */
export const ObjectType = (props: IObjectArgs): IObjectType => {
    if (!props.uuid) props.uuid = uuid.v1();
    if (!props.createdAt) props.createdAt = new Date();
    if (!props.updatedAt) props.updatedAt = props.createdAt;
    if (props.schema) props.schema = lodash.merge(ObjectSchema, props.schema);
    if (!props.key) {
        const prefix = lodash.kebabCase(props.objectType.replace('ObjectType', ''));
        const suffix = props.uuid.slice(-5);
        props.key = `${prefix}:${suffix}`;
    }

    if (!props.beforeValidate) props.beforeValidate = (p: IObjectType) => Promise.resolve(p);

    return {
        schema: ObjectSchema,
        ...<IObjectType>props,
    };
};

export const createObjectType = (...types: (IBasicObjectBuilder | IObjectBuilder)[]): IObjectBuilder => {
    return (props: IObjectArgs): Bluebird<IObjectType> => {
        const objectType = lodash.last(types).name;
        const beforeValidateHooks: IObjectBuilder[] = [];

        const preparedTypes = types.map((t: IBasicObjectBuilder): IObjectBuilder => {
            if (typeof t === 'function') {
                return (p: IObjectType) => (Bluebird.resolve(t(p)));
            }

            return t;
        });

        return Bluebird.reduce(
            preparedTypes,
            (p: IObjectType, t: IObjectBuilder) => {
                if (p.beforeValidate) beforeValidateHooks.push(p.beforeValidate);

                return t(p);
            },
            {objectType, ...<IObjectType>props},
        )
            .then((p: IObjectType) => ObjectType(p))
            .then((p: IObjectType) => (
                Bluebird.reduce(
                    beforeValidateHooks,
                    (object: IObjectType, hook: IObjectBuilder): IObjectType => (hook.bind(object)()),
                    p,
                )
            ));
        // if (types.length === 1) {
        //     objectType = types[0].name;
        //     object = ObjectType(types[0]({...<IObjectType>props, objectType}));
        //
        //     return Bluebird.reduce(
        //         [
        //             object.beforeValidate(object),
        //             validateObject(object, object.schema),
        //         ],
        //         (p: IObjectType) => (Promise.resolve(p)),
        //     );
        // }
        // const reversedTypes = types.reverse();
        // const beforeValidateFunctions = [];
        // objectType = reversedTypes[0].name;
        //
        // object = ObjectType({
        //     ...types.reduce(
        //         (params: IObjectType, func: Function): IObjectType => {
        //             const o = func(params);
        //             if (o.beforeValidate) beforeValidateFunctions.push(o.beforeValidate);
        //
        //             return <IObjectType>o;
        //         },
        //         <IObjectType>props,
        //     ), objectType,
        // });
        //
        // return Bluebird.reduce(
        //     [
        //         ...beforeValidateFunctions.map(
        //             (func: Function): Bluebird<IObjectType> => (func(object)),
        //         ),
        //         validateObject(object, object.schema),
        //     ],
        //     (p: IObjectType) => (Promise.resolve(p)),
        // );

    };
};
