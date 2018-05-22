import * as Bluebird from 'bluebird';
import {Context, ServiceMethods, ServiceSchema} from 'moleculer';
import * as uuid from 'uuid';

import {ISessionMetadata} from '../../../Portal/SessionService';
import {StateManager} from '../../../StateManager';

export interface IApp {
    appName: string;
    initialState?: object;
    started: Function;
    methods?: ServiceMethods;
    handleInput: Function;
}

export interface IAppMetadata extends ISessionMetadata {
    playerId?: number;
}

export interface IInputMessage extends ISessionMetadata {
    message: string | number;
    messageUuid: string;
    messageCreatedAt: number;
}

export const App = (app: IApp): Function => {
    return (config: ISessionMetadata): ServiceSchema => {
        return {
            name: `world.player.${config.uuid}`,
            metadata: {...config},
            dependencies: [`portal.player.${config.uuid}`],
            created() {
                this.logger.debug(`registered on 'world.player.${config.uuid}'`);
                this.state = new StateManager(app.initialState);
            },
            started(): Bluebird<void> {
                this.logger.debug(`started app '${app.appName}'`);

                return new Promise((resolve: Function) => {
                    app.started.bind(this)();
                    resolve();
                });
            },
            methods: {
                sendToScreen(message: string): Bluebird<void> {
                    return this.broker.call(`portal.player.${config.uuid}.sendToScreen`, {
                        ...this.metadata,
                        message,
                        messageUuid: uuid.v1(),
                        messageCreatedAt: new Date().getTime() / 1000,
                    });
                },
                switchApp(name: string) {
                    this.broker.broadcast('world.player.loadApp', {...this.metadata, app: name});
                },
                ...app.methods,
            },
            actions: {
                sendToWorld(ctx: Context): boolean {
                    app.handleInput.bind(this)(ctx.params);

                    return true;
                },
                sendToScreen(ctx: Context): Bluebird<void> {
                    return this.sendToScreen(ctx.params);
                },
            },
        };
    };
};
