import {
    extend,
    IObject,
    ObjectType,
} from '../ObjectType';

let WorldObjectType = (props: IObject): IObject => props;

WorldObjectType = extend(ObjectType, WorldObjectType);

export {WorldObjectType};
