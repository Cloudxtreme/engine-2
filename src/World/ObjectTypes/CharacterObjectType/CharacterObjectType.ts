import {
    IObject,
    ObjectType,
} from '../ObjectType';

export const CharacterObjectType = ObjectType((data: IObject) => ({
    schema: {
        key: {
            presence: true,
            uniqueKey: 'A character with that name already exists',
        },
    },
    ...data,
}));
