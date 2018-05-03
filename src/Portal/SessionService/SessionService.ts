import {
    ServiceSchema,
} from 'moleculer';
import {Socket} from 'net';
import * as uuid from 'uuid';

import {IPortalConfig} from '../Portal';

interface ISessionServiceConfig extends IPortalConfig {
    socket: Socket;
}

export const SessionService = (config: ISessionServiceConfig): ServiceSchema => {
    const sessionUuid: string = uuid.v1();

    return {
        name: `portal.player.${sessionUuid}`,
        metadata: {
            uuid: sessionUuid,
            createdAt: new Date().getTime() / 1000,
            remoteAddress: config.socket.remoteAddress,
        },
        methods: {
            onClose() {
                this.logger.info(`connection on '${config.socket.remoteAddress}' disconnected`);
                this.broker.broadcast('player.disconnected', this.metadata);
                this.broker.call('portal.telnet.destroySession', {uuid: sessionUuid});
            },
        },
        created() {
            this.logger.info(`connected on '${config.socket.remoteAddress}'`);
            config.socket.on('close', this.onClose);
        },
        started() {
            return new Promise((resolve: Function) => {
                this.broker.broadcast('player.connected', this.metadata);
                resolve();
            });
        },
    };
};
