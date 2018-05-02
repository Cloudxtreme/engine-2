"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const ServiceSchema_1 = require("../../ServiceSchema");
const StateManager_1 = require("../../StateManager");
class PlayMode extends ServiceSchema_1.ServiceSchema {
    constructor() {
        super(...arguments);
        this.initialState = {};
    }
    schema() {
        const schema = super.schema();
        return Object.assign({}, schema, { initialSate: this.initialState, methods: Object.assign({}, schema.methods, { onLoad: this.onLoad, sendToScreen: this.sendToScreen, callPortal: this.callPortal }), portalName: `portal.player.${this.metadata.uuid}` });
    }
    get name() {
        return `world.player.${this.metadata.uuid}`;
    }
    sendToScreen(message) {
        const msg = {
            messageUuid: uuid.v1(),
            message,
            timestamp: Math.round((new Date()).getTime() / 1000),
        };
        return this.callPortal('sendToScreen', msg);
    }
    onLoad() {
        return;
    }
    get dependencies() {
        return [
            `portal.player.${this.metadata.uuid}`,
        ];
    }
    created() {
        this.logger.debug(`received connection from ${this.metadata.remoteAddress}`);
        this.state = new StateManager_1.StateManager(this.initialState);
    }
    started() {
        return new Promise((resolve) => {
            this.onLoad();
            resolve();
            return;
        });
    }
    callPortal(action, args = {}) {
        const sch = this.schema;
        return this.broker.call(`${sch.portalName}.${action}`, args);
    }
}
exports.PlayMode = PlayMode;
//# sourceMappingURL=PlayMode.js.map