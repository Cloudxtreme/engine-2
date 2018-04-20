import {Context} from 'moleculer';

import {ISessionServiceSettings} from '../../Portal/SessionService';
import {ServiceSchema} from '../../ServiceSchema';
import {Login} from '../PlayModes/Login';

/**
 * creates new world player sessions
 */
export class SessionService extends ServiceSchema {
    public serviceSettings: ISessionServiceSettings;

    get name() {
        return 'world.sessions';
    }

    get actions() {
        return {
            connected: this.connected,
        };
    }

    public connected(ctx: Context) {
        this.logger.debug(`received new connection ${ctx.params.address} with id ${ctx.params.uuid}`);
        ctx.broker.createService(new Login(this.broker, {settings: {uuid: ctx.params.uuid}}).schema());
    }

}
