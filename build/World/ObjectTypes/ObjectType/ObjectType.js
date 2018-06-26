"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const lodash_1 = require("lodash");
const UUID = require("uuid");
function setUuid(object) {
    return ramda_1.when(ramda_1.pipe(ramda_1.prop("uuid"), ramda_1.isNil), ramda_1.assoc("uuid", UUID.v1()))(object);
}
function setKey(object) {
    return ramda_1.when(ramda_1.pipe(ramda_1.prop("key"), ramda_1.isNil), ramda_1.assoc("key", `${lodash_1.kebabCase(object.objectType)}:${object.uuid.slice(-5)}`))(object);
}
function setCreatedAt(object) {
    return ramda_1.when(ramda_1.pipe(ramda_1.prop("createdAt"), ramda_1.isNil), ramda_1.assoc("createdAt", new Date()))(object);
}
function setUpdatedAt(object) {
    return ramda_1.when(ramda_1.pipe(ramda_1.prop("createdAt"), ramda_1.isNil), ramda_1.assoc("updatedAt", new Date()))(object);
}
exports.ObjectType = function (objectType, ...definition) {
    return ramda_1.compose(setCreatedAt, setUpdatedAt, setKey, setUuid, ramda_1.assoc("objectType", objectType), ...definition);
};
