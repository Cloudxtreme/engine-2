import * as Bluebird from 'bluebird';
import {ServiceSchema} from 'moleculer';

import {ISessionMetadata} from '../../Portal/SessionService';
import {StateManager} from '../../StateManager';

interface IPlayMode {
    initialState?: object;
    started: Function;
}

export const PlayMode = (mode: IPlayMode): Function => {
    return (config: ISessionMetadata): ServiceSchema => {
        return {
            name: `world.player.${config.uuid}`,
            metadata: {...config},
            created() {
                this.state = new StateManager(mode.initialState);
            },
            started(): Bluebird<void> {
                return new Promise((resolve: Function) => {
                    mode.started.bind(this)();
                    resolve();
                });
            },
        };
    };
};
