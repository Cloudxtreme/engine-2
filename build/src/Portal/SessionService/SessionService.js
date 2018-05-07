"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
exports.SessionService = (config) => {
    const sessionUuid = uuid.v1();
    const metadata = {
        uuid: sessionUuid,
        createdAt: new Date().getTime() / 1000,
        remoteAddress: config.socket.remoteAddress,
    };
    return {
        name: `portal.player.${sessionUuid}`,
        metadata,
        methods: {
            onClose() {
                this.logger.info(`connection on '${config.socket.remoteAddress}' disconnected`);
                this.broker.broadcast('player.disconnected', this.metadata);
                this.broker.call('portal.telnet.destroySession', { uuid: sessionUuid });
            },
            sendToWorld(message) {
                this.broker.call(`world.player.${sessionUuid}.sendToWorld`, Object.assign({}, this.metadata, { message: message.toString(), messageUuid: uuid.v1(), messageCreatedAt: new Date().getTime() / 1000 }));
            },
        },
        actions: {
            sendToScreen(ctx) {
                config.socket.write(ctx.params.message);
            },
        },
        created() {
            this.logger.info(`connected on '${config.socket.remoteAddress}'`);
            config.socket.on('close', this.onClose);
            config.socket.on('data', this.sendToWorld);
        },
        started() {
            return new Promise((resolve) => {
                this.broker.broadcast('player.connected', this.metadata);
                resolve();
            });
        },
    };
};
//# sourceMappingURL=SessionService.js.map