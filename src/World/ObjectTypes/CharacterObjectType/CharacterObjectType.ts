import {
    IObjectType,
    ObjectType,
} from '../ObjectType';

export const CharacterObjectType = ObjectType((data: IObjectType) => ({
    schema: {
        key: {
            presence: true,
            uniqueKey: 'A character with that name already exists',
        },
        player_id: {
            presence: true,
        },
    },
    ...data,
}));
