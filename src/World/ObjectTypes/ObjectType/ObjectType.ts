import * as lodash from 'lodash';

export interface IObjectStore {
    [key: string]: IObject;
}

export interface IObject {
    uuid?: string;
    key?: string;
    object_type?: string;
    created_at?: number;
    updated_at?: number;
    objects?: IObjectStore;
    home?: string;
    destroyable?: boolean;
    live?: boolean;
    //tslint:disable-next-line
    schema?: any
}

export const ObjectType = (objectType: Function): Function => {
    let schema = {
        key: {
            presence: true,
            uniqueKey: 'An object with key \'%{value}\' already exists.',
        },
        object_type: {
            presence: true,
        },
    };

    return (config: IObject): IObject => {
        const object = objectType(config);

        if (object.schema) {
            schema = {
                ...schema,
                ...object.schema,
            };

            delete object.schema;
        }

        return {
            schema,
            ...objectType(config),
        };
    };
};
