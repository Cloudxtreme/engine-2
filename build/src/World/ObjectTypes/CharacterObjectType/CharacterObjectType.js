"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectType_1 = require("../ObjectType");
exports.CharacterObjectType = ObjectType_1.ObjectType((data) => (Object.assign({ schema: {
        key: {
            presence: true,
            uniqueKey: 'A character with that name already exists',
        },
        player_id: {
            presence: true,
        },
    } }, data)));
//# sourceMappingURL=CharacterObjectType.js.map