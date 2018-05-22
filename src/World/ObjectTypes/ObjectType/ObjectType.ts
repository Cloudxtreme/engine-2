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
    //tslint:disable-next-line
    data: any;
}

export const ObjectType = (props: IObject): IObject => {
    let schema = {
        ...{},
        ...props.schema,
        key: {
            presence: true,
            uniqueKey: 'An object with key \'%{value}\' already exists.',
        },
        object_type: {
            presence: true,
        },
        uuid: {},
    };

    schema = {...{}, ...props.schema, ...schema};

    return {
        schema,
        ...props,
    };
};
