import {ServiceSchema} from 'moleculer';

import {ISessionMetadata} from '../../../Portal/SessionService/index';
import {
    CreateCharacterApp,
    LoginApp,
    SelectCharacterApp,
    SignupApp,
} from '../../Apps/index';
import {IWorldConfig} from '../../World';

interface IAppPayload extends ISessionMetadata {
    app: string;
}

const APPS = {
    Signup: SignupApp,
    Login: LoginApp,
    CreateCharacter: CreateCharacterApp,
    SelectCharacter: SelectCharacterApp,
};

export const AppManagerService = (config: IWorldConfig): ServiceSchema => ({
    name: 'world.appManager',
    metadata: {...config},
    events: {
        'player.connected': function (payload: ISessionMetadata) {
            this.broker.broadcast('world.player.loadApp', {...payload, app: 'Login'});
        },
        'player.disconnected': function (payload: ISessionMetadata) {
            const service = this.broker.getLocalService(`world.player.${payload.uuid}`);
            if (service) {
                this.broker.destroyService(service);
            }
        },
        'world.player.loadApp': function (payload: IAppPayload) {
            const currentApp = this.broker.getLocalService(`world.player.${payload.uuid}`);
            const service = APPS[payload.app](payload);
            if (currentApp) {
                this.broker.destroyService(currentApp)
                    .then(() => {
                        this.broker.createService(service);
                    });
            } else {
                this.broker.createService(service);
            }
        },
    },
    methods: {
        loadApp(metadata: ISessionMetadata, app: string) {
            this.broker.broadcast('world.player.loadApp', {...metadata, app});
        },
    },
});
