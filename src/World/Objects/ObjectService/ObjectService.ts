import {IObject} from '../../DataServices/Snapshot';
import {Character} from '../Character';

const OBJECT_PROTOTYPES = {
    Character,
}

export const ObjectService = () => ({
    name: 'world.objects',
    actions: {
        create(object: IObject) {
            const newObject = Object(OBJECT_PROTOTYPES[object.item_type]());
        },
    },
});
