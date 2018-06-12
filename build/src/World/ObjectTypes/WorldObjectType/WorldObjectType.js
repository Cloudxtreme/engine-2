"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodeGlob = require("glob");
const path = require("path");
const ContainerObjectType_1 = require("../ContainerObjectType");
const ObjectType_1 = require("../ObjectType");
const ServiceObjectType_1 = require("../ServiceObjectType");
let WorldObjectType = class WorldObjectType extends ObjectType_1.ObjectType {
    initialize() {
        this.key = "world";
    }
    created() {
        this._setObjectTypePaths();
        this._registerObjectTypes();
        this.logger.info("loading latest snapshot...");
        this.broker
            .call("data.snapshot.getLatest")
            .then((data) => {
            if (!data) {
                this.logger.warn("----> no snapshot was found, starting fresh! <----");
                return this.saveSnapshot();
            }
            else {
            }
        });
    }
    get methods() {
        return {
            saveSnapshot() {
                this.logger.info("persisting snapshot");
                const serialized = this.schema.objectTypeDefinition.serialize();
                return this.broker
                    .call("data.snapshot.create", serialized)
                    .then((data) => {
                    this.broker.broadcast("world.snapshot.created", {
                        id: data.id,
                        updatedAt: data.updatedAt,
                    });
                    return data;
                });
            },
            _setObjectTypePaths() {
                this.objectTypePaths = [];
                this.objectTypePaths.push(path.resolve(__dirname, ".."));
            },
            _registerObjectTypes() {
                this.OBJECT_TYPES = {};
                this.logger.info("registering ObjectTypes...");
                const files = this.objectTypePaths.reduce((r, p) => {
                    return r.concat(nodeGlob.sync(path.join(p, "**/*Type.@(js|ts)")));
                }, []);
                files.forEach((file) => {
                    const objectType = path
                        .basename(file)
                        .replace(/(\.ts|\.js)/, "");
                    this.logger.debug(`registering '${objectType}'`);
                    this.OBJECT_TYPES[objectType] = require(file)[objectType];
                });
            },
        };
    }
    add() { }
    remove() { }
    emit() { }
    on() { }
};
WorldObjectType = tslib_1.__decorate([
    ObjectType_1.compose(ContainerObjectType_1.ContainerObjectType, ServiceObjectType_1.ServiceObjectType)
], WorldObjectType);
exports.WorldObjectType = WorldObjectType;
//# sourceMappingURL=WorldObjectType.js.map