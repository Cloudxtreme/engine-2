"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const WorldObjectType_1 = require("../../../ObjectTypes/WorldObjectType");
const DataService_1 = require("../DataService");
exports.ObjectDataService = DataService_1.DataService(() => ({
    name: 'object',
    create(_a) {
        var { key, object_type, player_id } = _a, data = tslib_1.__rest(_a, ["key", "object_type", "player_id"]);
        return this.db.returning('uuid')
            .insert({
            key,
            object_type,
            data,
            player_id,
        })
            .into('objects')
            .then((uuid) => {
            return WorldObjectType_1.WorldObjectType(Object.assign({ uuid,
                key,
                object_type }, data));
        });
    },
    actions: {
        findForPlayer(ctx) {
            return this.db.select()
                .where({ player_id: ctx.params.player_id, object_type: ctx.params.object_type })
                .from('objects')
                .then((data) => {
                return data;
            });
        },
    },
}));
//# sourceMappingURL=ObjectDataService.js.map