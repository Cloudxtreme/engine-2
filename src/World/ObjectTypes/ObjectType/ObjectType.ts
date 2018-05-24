import * as Bluebird from 'bluebird';
import * as lodash from 'lodash';
import * as uuid from 'uuid';

export interface IObjectSchema {
    [key: string]: IObjectConstraints;
}

interface IObjectConstraints {
    presence?: boolean;
    unique?: {
        validator: Function;
        errorMessage: string;
    };
}

export interface IObject {
    uuid: string;
    key: string;
    objectType: string;
    createdAt: Date;
    updatedAt: Date;
    schema: IObjectSchema;
}

export interface IObjectArgs {
    key?: string;
    uuid?: string;
    objectType?: string;
    createdAt?: Date;
    updatedAt?: Date;
    schema?: IObjectSchema;
}

export type IObjectBuilder = (props: IObjectArgs) => IObject;

const uniquenessValidator = (key: string): Bluebird<boolean> => {
    return new Promise((resolve: Function): Bluebird<boolean> => {
        return this.broker.call('world.index.exists', key)
            .then((exists: boolean) => {
                if (exists) return resolve(false);

                return resolve(true);
            });
    });
};

/**
 * The base ObjectType is the template used to create all world objects. All other ObjectTypes extend this type.
 */
export const ObjectType = (props: IObjectArgs): IObject => {
    const schema: IObjectSchema = {
        uuid: {
            presence: true,
        },
        key: {
            presence: true,
            unique: {
                validator: uniquenessValidator.bind(this),
                errorMessage: 'An object with key \'%{value}\' already exists.',
            },
        },
        objectType: {
            presence: true,
        },
    };

    if (!props.uuid) props.uuid = uuid.v1();
    if (!props.createdAt) props.createdAt = new Date();
    if (!props.updatedAt) props.updatedAt = props.createdAt;
    if (props.schema) props.schema = lodash.merge(schema, props.schema);

    return {
        schema,
        ...<IObject>props,
    };
};

export const extend = (...types: IObjectBuilder[]): IObjectBuilder => {
    if (types.length === 1) {
        return (props: IObjectArgs) => {
            const objectType = types[0].name;

            return ObjectType(types[0]({...props, objectType}));
        };
    }

    return (props: IObjectArgs): IObject => {
        return ObjectType(types.reverse().reduce(
            (object: IObject, t: Function) => {
                return lodash.merge({...{}}, {...object, ...t(object)});
            },
            props,
        ));
    };
};
