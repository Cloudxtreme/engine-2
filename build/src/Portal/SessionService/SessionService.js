"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
exports.SessionService = (config) => {
    const sessionUuid = uuid.v1();
    return {
        name: `portal.player.${sessionUuid}`,
        metadata: {
            uuid: sessionUuid,
            createdAt: new Date().getTime() / 1000,
            remoteAddress: config.socket.remoteAddress,
        },
        created() {
            this.logger.info(`connected on '${config.socket.remoteAddress}'`);
            config.socket.on('close', () => {
                this.logger.info(`connection on '${config.socket.remoteAddress}' disconnected`);
                this.broker.broadcast('player.disconnected', this.metadata);
                this.broker.call('portal.telnet.destroySession', { uuid: sessionUuid });
            });
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