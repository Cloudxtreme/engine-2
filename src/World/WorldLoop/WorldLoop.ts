import {ServiceSchema} from 'moleculer';

import {ISessionMetadata} from '../../Portal/SessionService';
import {App, Login, Signup} from '../Apps';
import {IWorldConfig} from '../World';



export const WorldLoop = (config: IWorldConfig): ServiceSchema => {
    return {
        name: 'world.loop',
    };
};
