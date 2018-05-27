import {
    extend,
    IObject,
    ObjectType,
} from '../ObjectType';

let WorldObjectType = (props: IObject): IObject => props;

WorldObjectType = extend(WorldObjectType);

export {WorldObjectType};
