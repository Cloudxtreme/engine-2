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
}

export interface IObject {
    uuid: string;
    key: string;
    objectType: string;
    createdAt: Date;
    updatedAt: Date;
    schema: IObjectSchema;
    beforeValidate: Function;
}

export interface IObjectArgs {
    key?: string;
    uuid?: string;
    objectType?: string;
    createdAt?: Date;
    updatedAt?: Date;
    schema?: IObjectSchema;
    beforeValidate?: Function;
}

export type IObjectBuilder = (props: IObjectArgs) => IObject;
type IExtendResult = (props: IObjectArgs) => Bluebird<IObject>;

const validateObject = (object: IObject, schema: IObjectSchema): Bluebird<Object> => {
    return new Promise((resolve: (value: any) => any, reject: (reason: any) => any) => {
        return validate.async(object, schema, {cleanAttributes: false})
            .then(
                resolve,
                reject,
            );
    });
};

/**
 * ObjectType is the base type from which all other objects are derived. World objects are never created from
 * ObjectType, but instead are created with the various extensions of this type.
 */
export const ObjectType = (props: IObjectArgs): IObject => {
    const schema: IObjectSchema = {
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

    if (!props.uuid) props.uuid = uuid.v1();
    if (!props.createdAt) props.createdAt = new Date();
    if (!props.updatedAt) props.updatedAt = props.createdAt;
    if (props.schema) props.schema = lodash.merge(schema, props.schema);
    if (!props.key) {
        const prefix = props.objectType.replace('ObjectType', '').toLowerCase();
        const suffix = lodash.last(props.uuid.split('-'));
        props.key = `${prefix}-${suffix}`;
    }

    if (!props.beforeValidate) props.beforeValidate = (p: IObject) => Promise.resolve(p);

    return {
        schema,
        ...<IObject>props,
    };
};

export const createObjectType = (...types: IObjectBuilder[]): IExtendResult => {
    let objectType;
    let object;

    return (props: any) => {
        if (types.length === 1) {
            objectType = types[0].name;
            object = ObjectType(types[0]({...props, objectType}));

            return Bluebird.reduce(
                [
                    object.beforeValidate(object),
                    validateObject(object, object.schema),
                ],
                (p: IObject) => (Promise.resolve(p)),
            );
        }
        const reversedTypes = types.reverse();
        const beforeValidateFunctions = [];
        objectType = reversedTypes[0].name;

        object = ObjectType({
            ...types.reduce(
                (params: IObject, func: Function): IObject => {
                    const o = func(params);
                    if (o.beforeValidate) beforeValidateFunctions.push(o.beforeValidate);

                    return <IObject>o;
                },
                <IObject>props,
            ), objectType,
        });

        return Bluebird.reduce(
            [
                ...beforeValidateFunctions.map(
                    (func: Function): Bluebird<IObject> => (func(object)),
                ),
                validateObject(object, object.schema),
            ],
            (p: IObject) => (Promise.resolve(p)),
        );

    };
};
