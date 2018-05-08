import {
    Context,
    ServiceSchema,
} from 'moleculer';
import {Socket} from 'net';
import * as uuid from 'uuid';

import {IPortalConfig} from '../Portal';

interface ISessionServiceConfig extends IPortalConfig {
    socket: Socket;
}

export interface ISessionMetadata {
    uuid: string;
    createdAt: number;
    remoteAddress: string;
}

export const SessionService = (config: ISessionServiceConfig): ServiceSchema => {
    const sessionUuid: string = uuid.v1();
    const metadata: ISessionMetadata = {
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
                this.broker.call('portal.telnet.destroySession', {uuid: sessionUuid});
            },
            sendToWorld(message: Buffer) {
                const input = this.cleanInput(message.toString());
                this.logger.debug(`sending input '${input} to world`);
                this.broker.call(`world.player.${sessionUuid}.sendToWorld`, {
                    ...this.metadata,
                    message: input,
                    messageUuid: uuid.v1(),
                    messageCreatedAt: new Date().getTime() / 1000,
                });
            },
            cleanInput(input: string) {
                return input.replace(/\r\n/,'');
            },
        },
        actions: {
            sendToScreen(ctx: Context) {
                config.socket.write(ctx.params.message);
            },
            disconnect() {
                config.socket.destroy();
            },
        },
        created() {
            this.logger.info(`connected on '${config.socket.remoteAddress}'`);
            config.socket.on('close', this.onClose);
            config.socket.on('data', this.sendToWorld);
        },
        started() {
            return new Promise((resolve: Function) => {
                this.broker.broadcast('player.connected', this.metadata);
                resolve();
            });
        },
    };
};
