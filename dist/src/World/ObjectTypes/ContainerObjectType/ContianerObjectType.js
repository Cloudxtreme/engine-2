"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ContainerObjectType = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ObjectType = require("../ObjectType");

var _EventedObjectType = require("../EventedObjectType");

var ContainerObjectType = function ContainerObjectType(traits) {
    var schema = {
        objects: {
            presence: true,
            objectType: "object"
        }
    };

    return _extends({
        objects: {}
    }, traits, {
        schema: schema,
        addObject: function addObject(object) {
            object.container = this;
            this.objects[object.key] = object;
            this.emit("object.added", _extends({}, object));
        },
        removeObject: function removeObject(objectOrKey) {
            if ((typeof objectOrKey === "undefined" ? "undefined" : _typeof(objectOrKey)) === "object") {
                objectOrKey = object.key;
            }
            var objectToRemove = _extends({}, this.objects[objectOrKey]);
            delete objectToRemove.container;
            delete this.objects[objectOrKey];
            this.emit("object.removed", objectToRemove);
        },
        afterValidate: function afterValidate() {
            var _this = this;

            this.on("object.removed", function (object) {
                if (_this.container) {
                    _this.container.emit("object.removedFromDescendant", {
                        key: _this.key,
                        object: object
                    });
                }
            });
            this.on('object.removedFromDescendant', function (_ref) {
                var key = _ref.key,
                    object = _ref.object;

                if (_this.container) {
                    _this.container.emit("object.removedFromDescendant", { key: _this.key + "." + key, object: object });
                }
            });
            this.on('object.added', function (object) {
                if (_this.container) {
                    _this.container.emit('object.addedToDescendant', { key: _this.key + "." + object.key, object: object });
                }
            });
            this.on('object.addedToDescendant', function (_ref2) {
                var key = _ref2.key,
                    object = _ref2.object;

                if (_this.container) {
                    _this.container.emit("object.addedToDescendant", { key: _this.key + "." + key, object: object });
                }
            });
        }
    });
};

exports.ContainerObjectType = ContainerObjectType = (0, _ObjectType.combine)(_EventedObjectType.EventedObjectType, ContainerObjectType);

exports.ContainerObjectType = ContainerObjectType;
//# sourceMappingURL=ContianerObjectType.js.map