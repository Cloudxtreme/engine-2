"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const World_1 = require("../../Objects/World");
const DataService_1 = require("../DataService");
exports.Object = DataService_1.DataService(() => ({
    name: 'object',
    create(_a) {
        var { key, object_type } = _a, data = tslib_1.__rest(_a, ["key", "object_type"]);
        return this.db.returning('uuid')
            .insert({
            key,
            object_type,
            data,
        })
            .into('objects')
            .then((uuid) => {
            return World_1.World(Object.assign({ uuid,
                key,
                object_type }, data));
        });
    },
}));
//# sourceMappingURL=Object.js.map