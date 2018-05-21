import {compose} from '../../../utils';
import {
    IObject,
    ObjectType,
} from '../ObjectType';

let WorldObjectType = (data: IObject) => ({
    ...data,
    object_type: 'World',
    key: 'world',
    updated_at: new Date(),
    live: true,
    destroyable: false,
    objects: {},
});

WorldObjectType = compose(ObjectType, WorldObjectType);

export {WorldObjectType};
