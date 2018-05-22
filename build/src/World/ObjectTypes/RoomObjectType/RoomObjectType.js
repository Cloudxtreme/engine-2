"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectType_1 = require("../ObjectType");
const utils_1 = require("../../../utils");
let RoomObjectType = (data) => {
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
exports.RoomObjectType = RoomObjectType;
exports.RoomObjectType = RoomObjectType = utils_1.compose(ObjectType_1.ObjectType, RoomObjectType);
//# sourceMappingURL=RoomObjectType.js.map