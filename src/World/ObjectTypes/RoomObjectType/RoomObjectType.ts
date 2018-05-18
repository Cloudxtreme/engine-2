import {IObject, ObjectType} from '../ObjectType';

interface IRoom extends IObject {
    title: string;
    description: string;
    shortDescription: string;
    exits: IExitList;
}

interface IExit {
    roomId: string;
}

interface IExitList {
    direction: string;
    exit: IExit;
}

export const RoomObjectType = ObjectType((data: IRoom) => ({
    ...data,
    live: true,
    object_type: 'Room',
    destroyable: false,
    updateOnRestart: true,
}));
