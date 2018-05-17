import {
    IObject,
    ObjectType,
} from '../ObjectType';

export const CharacterObjectType = ObjectType((data: IObject) => ({
    ...data,
}));
