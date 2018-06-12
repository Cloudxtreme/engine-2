import * as nodeGlob from "glob";
import {
    Actions,
    LoggerInstance,
    Service,
    ServiceEvents,
    ServiceMethods,
} from "moleculer";
import * as path from "path";

import {
    ContainerObjectType,
    IContainerObjectType,
    TObjectContainer,
} from "../ContainerObjectType";
import { compose, IObjectType, ObjectType } from "../ObjectType";
import { IServiceObjectType, ServiceObjectType } from "../ServiceObjectType";

interface IWorldType {
    snapshotId: string;
    snapshotCreatedAt: Date;
    objectTypePaths: string[];
    OBJECT_TYPES: TObjectTypeDictionary;
}

type TObjectTypeDictionary = {
    [key: string]: Object;
};

@compose(
    ContainerObjectType,
    ServiceObjectType,
)
export class WorldObjectType extends ObjectType
    implements IContainerObjectType, IServiceObjectType, IWorldType {
    readonly actions: Actions;
    readonly events: ServiceEvents;
    readonly objects: TObjectContainer;
    readonly service: Service;
    readonly logger: LoggerInstance;
    readonly methods: ServiceMethods;
    snapshotId: string;
    snapshotCreatedAt: Date;
    readonly objectTypePaths: string[];

    readonly OBJECT_TYPES: TObjectTypeDictionary;

    initialize() {
        this.key = "world";
    }

    created() {
        this._setObjectTypePaths();
        this._registerObjectTypes();

        this.logger.info("loading latest snapshot...");
        this.broker
            .call("data.snapshot.getLatest")
            .then((data: IWorldType | boolean) => {
                if (!data) {
                    this.logger.warn(
                        "----> no snapshot was found, starting fresh! <----",
                    );

                    return this.saveSnapshot();
                } else {
                }
            });
    }

    get methods(): ServiceMethods {
        return {
            saveSnapshot() {
                this.logger.info("persisting snapshot");
                const serialized = this.schema.objectTypeDefinition.serialize();

                return this.broker
                    .call("data.snapshot.create", serialized)
                    .then((data: IObjectType) => {
                        this.broker.broadcast("world.snapshot.created", {
                            id: data.id,
                            updatedAt: data.updatedAt,
                        });

                        return data;
                    });
            },
            // tslint:disable-next-line:function-name
            _setObjectTypePaths() {
                this.objectTypePaths = [];
                this.objectTypePaths.push(path.resolve(__dirname, ".."));
            },
            // tslint:disable-next-line:function-name
            _registerObjectTypes() {
                this.OBJECT_TYPES = {};
                this.logger.info("registering ObjectTypes...");
                const files = this.objectTypePaths.reduce(
                    (r: string[], p: string) => {
                        return r.concat(
                            nodeGlob.sync(path.join(p, "**/*Type.@(js|ts)")),
                        );
                    },
                    [],
                );
                files.forEach((file: string) => {
                    const objectType = path
                        .basename(file)
                        .replace(/(\.ts|\.js)/, "");
                    this.logger.debug(`registering '${objectType}'`);
                    // tslint:disable-next-line:non-literal-require
                    this.OBJECT_TYPES[objectType] = require(file)[objectType];
                });
            },
        };
    }

    add(): void {}
    remove(): void {}
    emit(): void {}
    on(): void {}
}
