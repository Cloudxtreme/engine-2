import {ServiceSchema} from 'moleculer';

import {ISessionMetadata} from '../../Portal/SessionService';
import {App, Signup} from '../Apps';
import {IWorldConfig} from '../World';

interface IAppPayload extends ISessionMetadata {
    app: string;
}

const APPS = {
    Signup,
};

export const WorldLoop = (config: IWorldConfig): ServiceSchema => {
    return {
        name: 'world.loop',
        metadata: {...config},
        events: {
            'player.connected': function (payload: ISessionMetadata) {
                this.broker.broadcast('world.player.loadApp', {...payload, app: 'Signup'});
            },
            'player.disconnected': function (payload: ISessionMetadata) {
                const service = this.broker.getLocalService(`world.player.${payload.uuid}`);
                if (service) {
                    this.broker.destroyService(service);
                }
            },
            'world.player.loadApp': function (payload: IAppPayload) {
                const currentApp = this.broker.getLocalService(`world.player.${payload.uuid}`);
                if (currentApp) {
                    this.broker.destroyService(currentApp);
                }
                const service = App(APPS[payload.app])(payload);
                this.broker.createService(service);
            },
        },
        methods: {
            loadApp(metadata: ISessionMetadata, app: string) {
                this.broker.broadcast('world.player.loadApp', {...metadata, app});
            },
        },
    };
};
