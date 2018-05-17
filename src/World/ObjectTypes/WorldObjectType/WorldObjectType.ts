
import {IObject, IObjectStore, ObjectType} from '../ObjectType';

export const WorldObjectType = ObjectType((data: IObject) => ({
    ...data,
    object_type: 'World',
    key: 'world',
    updated_at: new Date(),
    live: true,
    destroyable: false,
    objects: {},
}));
