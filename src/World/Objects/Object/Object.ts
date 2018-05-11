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
}
export const Object = (objectType: Function): Function => {
    return (config: IObject): IObject => {
        return objectType(config);
    };
};
