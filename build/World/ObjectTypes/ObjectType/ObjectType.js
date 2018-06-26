"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const ramda_1 = require("ramda");
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
    return ramda_1.when(ramda_1.pipe(ramda_1.prop("updatedAt"), ramda_1.isNil), ramda_1.assoc("updatedAt", new Date()))(object);
}
function setObjectTypes(object) {
    return ramda_1.when(ramda_1.pipe(ramda_1.prop("objectTypes"), ramda_1.isNil), ramda_1.assoc("objectTypes", []))(object);
}
const addObjectType = ramda_1.curry(function (objectType, object) {
    return ramda_1.when(ramda_1.pipe(ramda_1.prop("objectTypes"), ramda_1.any), ramda_1.assoc("objectTypes", ramda_1.pipe(ramda_1.prop("objectTypes"), ramda_1.append(objectType))(object)))(object);
});
exports.ObjectType = function (objectType, ...definition) {
    return ramda_1.compose(setUpdatedAt, setCreatedAt, setKey, setUuid, ...definition, addObjectType(objectType), setObjectTypes, ramda_1.assoc("objectType", objectType), ramda_1.pipe(ramda_1.when(ramda_1.isNil, () => { })));
};
