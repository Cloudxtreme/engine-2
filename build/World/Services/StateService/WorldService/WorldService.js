"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate = require("validate.js");
const ObjectTypes_1 = require("../../../ObjectTypes");
exports.WorldService = {
    name: 'world.state.world',
    created() {
        this.logger.debug('loading initial world state');
        return this.broker.call('data.snapshot.getLatest')
            //tslint:disable-next-line
            .then((state) => {
            if (!state) {
                this.logger.warn('no existing snapshot');
                return this.newWorld()
                    .then((world) => {
                    this.logger.warn('creating initial snapshot');
                    return this.broker.call('data.snapshot.create', world);
                });
            }
            this.logger.info(`loading world from snapshot '${state.created_at}'`);
            return ObjectTypes_1.WorldObjectType(Object.assign({}, state, state.data));
        })
            .then((world) => this.liveLoad(world))
            .then((world) => {
            const worldAttributes = validate.cleanAttributes(world, world.schema);
            delete worldAttributes.updated_at;
            this.redis.set('lucid.state', JSON.stringify({ world: worldAttributes }));
        });
    },
};
