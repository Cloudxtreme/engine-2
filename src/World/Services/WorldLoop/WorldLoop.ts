import {ServiceSchema} from 'moleculer';

import {ISessionMetadata} from '../../../Portal/SessionService/index';
import {App, Login, Signup} from '../../Apps/index';
import {IWorldConfig} from '../../World';

export const WorldLoop = (config: IWorldConfig): ServiceSchema => {
    return {
        name: 'world.loop',
    };
};
