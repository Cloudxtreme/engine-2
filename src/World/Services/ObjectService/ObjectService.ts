import * as Bluebird from 'bluebird';
import {Context} from 'moleculer';
import * as validate from 'validate.js';
import {
    CharacterObjectType,
    IObject,
    WorldObjectType,
} from '../../ObjectTypes';
import {IWorldConfig} from '../../World';

interface ICreateObject extends IObject {
    playerUuid?: string;
}

interface IError {
    [index: string]: [string]
}

const OBJECT_PROTOTYPES = {
    World: WorldObjectType,
    Character: CharacterObjectType,
};

export const ObjectService = (config: IWorldConfig) => ({
    name: 'world.objects',
    metadata: config,
    actions: {
        build(ctx: Context): Bluebird<IObject> {
            return this.create(ctx.params);
        },
        buildAndCreate(ctx: Context): Bluebird<IObject> {
            return this.build(ctx.params)
                .then((object: IObject) => (this.create(object)));
        },
    },
    methods: {
        /**
         * Creates a transient object, transient objects are not persisted, and will not survive a state reset of
         * what ever parent object it is placed in.
         * @param {IObject} props the object props. Requires a key (which must be unique), and the object_type
         * @returns {IObject}
         */
        build(props: IObject): Bluebird<IObject> {
            this.logger.debug(`building '${props.object_type}' object`);

            return Promise.resolve(OBJECT_PROTOTYPES[props.object_type](props));
        },
        /**
         * Saves an object to the database. When objects are saved to the database, they will be restored to their
         * "home" position when the containing object is reloaded.
         * @param {IObject} object
         * @returns {Bluebird<IObject>}
         */
        create(object: ICreateObject): Bluebird<IObject> {
            this.logger.debug(`saving '${object.object_type}:${object.key}'`);

            const success = (attributes: IObject) => (attributes);
            const error = (errors: Error | IError) => {
                if (errors instanceof Error) {
                    this.logger.error(errors);

                    return false;
                } else {
                    this.logger.warn(errors);

                    if (object.playerUuid) {
                        return this.broker.call(
                            `world.player.${object.playerUuid}.sendToScreen`,
                            `${errors.key[0].replace('Key', '')}\n`,
                        );
                    }

                    return false;
                }
            };

            return validate.async(object, object.schema)
                .then(success, error);
        },
    },
    created() {
        validate.validators.uniqueKey = (value: string, errorString: string): Bluebird<string | void> => {
            return new Promise((resolve: Function) => {
                return this.broker.call('data.object.keyExists', value)
                    .then((exists: boolean) => {
                        if (exists) {
                            resolve();
                        } else {
                            resolve(errorString);
                        }
                    });
            });
        };
    },
});
