"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceSchema_1 = require("../../ServiceSchema");
const uuid = require("uuid/v4");
class SessionService extends ServiceSchema_1.ServiceSchema {
    get methods() {
        return {
            processInput: this.processInput,
        };
    }
    get actions() {
        return {
            sendToScreen: this.sendToScreen,
        };
    }
    constructor(broker, options) {
        super(broker, options);
        this.socket = options.socket;
    }
    get name() {
        return `portal.sessions.${this.serviceSettings.uuid}`;
    }
    created() {
        const socket = this.socket;
        return function () {
            this.socket = socket;
            this.logger.debug(`received connection from ${this.socket.remoteAddress}`);
            this.broker.call('world.sessions.connected', {
                address: this.socket.remoteAddress,
                uuid: this.settings.uuid,
            });
        };
    }
    processInput(rawText) {
        return {
            rawText,
            sessionUUID: this.settings.uuid,
            messageUUID: uuid(),
            remoteAddress: this.socket.remoteAddress,
            timestamp: new Date(),
        };
    }
    sendToScreen(ctx) {
        this.logger.debug(`received message ${ctx.params.message}`);
        this.socket.write(ctx.params.message);
    }
    schema() {
        const schema = super.schema();
        return Object.assign({}, schema, { created: this.created() });
    }
}
exports.SessionService = SessionService;
//# sourceMappingURL=SessionService.js.map