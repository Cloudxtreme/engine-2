"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require("glob-fs");
const path = require("path");
const g = glob();
exports.RoomService = {
    name: 'world.state.roomService',
    created() {
        return this.loadRooms()
            .then(() => this.logger.info('world loading complete'))
            .catch((e) => {
            this.logger.fatal(e);
            process.exit(1);
        });
    },
    methods: {
        loadRooms() {
            this.logger.info('registering rooms with object service');
            return g.readdirPromise('rooms/*.js')
                .then((files) => {
                return Promise.all(files.map((file) => {
                    this.logger.info(`registering '${file}'`);
                    return this.broker.call('world.objects.registerObjectType', { file })
                        .then(() => {
                        return file;
                    });
                }));
            })
                .then((files) => {
                this.logger.info('syncing rooms to object table');
                return Promise.all(files.map((file) => {
                    const t = path.basename(file).replace('.js', '');
                    //tslint:disable-next-line:non-literal-require
                    const room = require(file)();
                    this.logger.debug(`syncing '${room.key}'`);
                    return this.broker.call('world.objects.createOrUpdate', Object.assign({}, room, { object_type: t }))
                        .then((object) => (Object.assign({}, object, room, { object_type: t })));
                }));
            })
                .then((rooms) => {
                this.logger.info(`placing ${rooms.length} rooms into world`);
                rooms.forEach((room) => this.placeObject(room));
            })
                .catch((e) => {
                this.logger.error(e);
                process.exit(1);
            });
        },
    },
};
