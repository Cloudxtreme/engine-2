import {ServiceSchema} from 'moleculer';

import {ISessionMetadata} from '../../Portal/SessionService';
import {LoginPlayMode, PlayMode} from '../PlayMode';
import {IWorldConfig} from '../World';

export const WorldLoop = (config: IWorldConfig): ServiceSchema => {
    return {
        name: 'world.loop',
        metadata: {...config},
        events: {
            'player.connected': function(payload: ISessionMetadata) {
                this.broker.createService(PlayMode(LoginPlayMode)(payload));
            },
            'player.disconnected': function(payload: ISessionMetadata) {
                this.broker.destroyService(this.broker.getLocalService(`world.player.${payload.uuid}`));
            },
        },
    };
};
