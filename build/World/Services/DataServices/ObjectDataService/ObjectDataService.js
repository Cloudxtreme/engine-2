"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObjectType_1 = require("../../../ObjectTypes/WorldObjectType");
const DataService_1 = require("../DataService");
exports.ObjectDataService = DataService_1.DataService(() => ({
    name: 'object',
    // tslint:disable-next-line
    create(_a) {
        var { key, object_type, player_id } = _a, data = __rest(_a, ["key", "object_type", "player_id"]);
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
                // tslint:disable-next-line
                .then((data) => {
                return data;
            });
        },
        keyExists(ctx) {
            return this.db.count('*')
                .where({ key: ctx.params })
                .from('objects')
                .then((result) => {
                return parseInt(result[0].count, 10) > 0;
            });
        },
        updateForKey(ctx) {
            return this.db.returning('uuid')
                .update(ctx.params.props)
                .from('objects')
                .where({ key: ctx.params.key })
                .then((object) => {
                return Object.assign({ uuid: object[0] }, ctx.params.props);
            });
        },
    },
}));
