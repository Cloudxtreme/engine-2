
import {IObject, IObjectStore, Object} from '../Object';

export interface IWorldObject extends IObject {
}

export const World = Object(({uuid, created_at, data}) => ({
    uuid,
    key: 'world',
    object_type: 'World',
    created_at,
    updated_at: new Date(),
    ...data,
    live: true,
}));
