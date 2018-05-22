import * as Bluebird from 'bluebird';
import * as glob from 'glob-fs';
import * as path from 'path';

import {ServiceSchema} from 'moleculer';

import {IObject, IRoom} from '../../../ObjectTypes';

const g = glob();

export const RoomService: ServiceSchema = {
    name: 'world.state.roomService',
    created() {
        return this.loadRooms()
            .then(() => this.logger.info('world loading complete'))
            .catch((e: Error) => {
                this.logger.fatal(e);

                process.exit(1);
            });
    },
    methods: {
        loadRooms(): Bluebird<void> {
            this.logger.info('registering rooms with object service');

            return g.readdirPromise('rooms/*.js')
                .then((files: [string]): Bluebird<IRoom[]> => {

                    return Promise.all(files.map((file: string) => {
                        this.logger.info(`registering '${file}'`);

                        return this.broker.call('world.objects.registerObjectType', {file})
                            .then(() => {
                                return file;
                            });
                    }));
                })
                .then((files: string[]): Bluebird<IRoom[]> => {
                    this.logger.info('syncing rooms to object table');

                    return Promise.all(files.map((file: string): Bluebird<IRoom> => {
                        const t = path.basename(file).replace('.js', '');
                        //tslint:disable-next-line:non-literal-require
                        const room = require(file)();
                        this.logger.debug(`syncing '${room.key}'`);

                        return this.broker.call('world.objects.createOrUpdate', {...room, object_type: t})
                            .then((object: IObject) => (
                                {...object, ...room, object_type: t}))
                            ;
                    }));
                })
                .then((rooms: IRoom[]) => {
                    this.logger.info(`placing ${rooms.length} rooms into world`);
                    rooms.forEach((room: IRoom) => this.placeObject(room));
                })
                .catch((e: Error) => {
                    this.logger.error(e);
                    process.exit(1);
                });
        },
    },
};
