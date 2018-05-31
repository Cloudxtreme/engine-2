"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.combine = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bluebird = require("bluebird");

var Bluebird = _interopRequireWildcard(_bluebird);

var _lodash = require("lodash");

var lodash = _interopRequireWildcard(_lodash);

var _validate = require("validate.js");

var validate = _interopRequireWildcard(_validate);

var _uuid = require("uuid");

var uuid = _interopRequireWildcard(_uuid);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var ObjectSchema = {
    uuid: {
        presence: true
    },
    key: {
        presence: true
    },
    objectType: {
        presence: true
    }
};

var validateObject = function validateObject(object, schema) {
    return new Promise(function (resolve, reject) {
        return validate.async(object, schema, { cleanAttributes: false }).then(resolve, reject);
    });
};

validate.validators.objectType = function (value, options) {
    return new Promise(function (resolve, reject) {
        if (!value) return resolve();

        if (options === true) {
            var t = value;
            return validateObject(t, t.schema).then(function () {
                return resolve();
            }).catch(function (e) {
                return resolve(e);
            });
        } else if (options === "array") {
            var _t = value;
            return Bluebird.all(_t.map(function (v) {
                return validateObject(v, v.schema);
            })).then(function () {
                return resolve();
            }).catch(function (e) {
                return resolve(e);
            });
        } else if (options === "object") {
            var _t2 = value;
            return Bluebird.all(lodash.values(_t2).map(function (v) {
                return validateObject(v, v.schema);
            })).then(function () {
                return resolve();
            }).catch(function (e) {
                return resolve(e);
            });
        } else {
            return reject("invalid option");
        }
    });
};

var ObjectType = function ObjectType(traits) {
    // set the defaults
    if (!traits.uuid) traits.uuid = uuid.v1();
    if (!traits.createdAt) traits.createdAt = new Date();
    if (!traits.updatedAt) traits.updatedAt = traits.createdAt;

    // auto generate the key if not present
    if (!traits.key) {
        var prefix = lodash.kebabCase(traits.objectType.replace("ObjectType", ""));
        var suffix = traits.uuid.slice(-5);
        traits.key = prefix + ":" + suffix;
    }

    // add a default beforeValidate hook
    if (!traits.beforeValidate) traits.beforeValidate = function (p) {
        return Promise.resolve(p);
    };

    return _extends({
        schema: lodash.merge({}, traits.schema || {}, ObjectSchema)
    }, traits, {
        inherits: function inherits(nameOrType) {
            if (typeof nameOrType === "function") {
                nameOrType = nameOrType.name;
            }

            return lodash.indexOf(this.inherited, nameOrType) !== -1;
        }
    });
};

var combine = exports.combine = function combine() {
    for (var _len = arguments.length, types = Array(_len), _key = 0; _key < _len; _key++) {
        types[_key] = arguments[_key];
    }

    var objectType = lodash.last(types).name;
    return function () {
        var traits = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var beforeValidateHooks = [];
        var afterValidateHooks = [];
        var inherited = [];

        var preparedTypes = types.map(function (type) {
            inherited.push(type.name);
            if (typeof type === "function") return function (trts) {
                return Bluebird.resolve(type(trts));
            };
            return type;
        });

        return Bluebird.reduce(preparedTypes, function (aggregateType, type) {
            return type(aggregateType).then(function (t) {
                if (t.beforeValidate) beforeValidateHooks.push(t.beforeValidate);
                if (t.afterValidate) afterValidateHooks.push(t.afterValidate);
                return _extends({}, t, { objectType: objectType });
            });
        }, _extends({}, traits, { objectType: objectType, inherited: inherited })).then(function (newObject) {
            return ObjectType(newObject);
        }).then(function (newObject) {
            lodash.keys(newObject).forEach(function (key) {
                var value = newObject[key];
                if (typeof value === "function") {
                    newObject[key] = value.bind(newObject);
                }
            });

            return newObject;
        }).then(function (newObject) {
            return Bluebird.reduce(beforeValidateHooks, function (r, hook) {
                return hook(r);
            }, newObject);
        }).then(function (newObject) {
            return Bluebird.each(afterValidateHooks, function (hook) {
                return hook.bind(newObject)();
            }).then(function () {
                return newObject;
            });
        }).then(function (newObject) {
            if (!newObject.schema) return;
            return validate.async(newObject, newObject.schema, { cleanAttributes: false });
        });
    };
};
//# sourceMappingURL=ObjectType.js.map