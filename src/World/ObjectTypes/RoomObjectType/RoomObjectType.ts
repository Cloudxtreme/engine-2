import {
    IObjectType,
    ObjectType,
} from '../ObjectType';

import {compose} from '../../../utils';

export interface IRoom extends IObjectType {
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

let RoomObjectType = (data: IRoom) => {
    const schema = {
        data: {
            presence: true,
        },
        'data.location': {
            presence: true,
        },
        'data.attributes.title': {
            presence: true,
        },
        'data.attributes.description': {
            presence: true,
        },
        'data.attributes.shortDescription': {
            presence: true,
        },
    };

    const key = data.key;
    delete data.key;

    return {
        key,
        schema,
        data,
        live: true,
        destroyable: false,
        updateOnRestart: true,
    };
};

RoomObjectType = compose(ObjectType, RoomObjectType);

export {RoomObjectType};
