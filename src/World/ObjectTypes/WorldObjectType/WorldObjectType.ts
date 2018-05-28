import {
    extend,
    IObjectType,
    ObjectType,
} from '../ObjectType';

let WorldObjectType = (props: IObjectType): IObjectType => props;

WorldObjectType = extend(WorldObjectType);

export {WorldObjectType};
