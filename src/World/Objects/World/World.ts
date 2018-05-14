
import {IObject, IObjectStore, Object} from '../Object';

export const World = Object((data: IObject) => ({
    ...data,
    object_type: 'World',
    key: 'world',
    updated_at: new Date(),
    live: true,
    destroyable: false,
    objects: {},
}));
