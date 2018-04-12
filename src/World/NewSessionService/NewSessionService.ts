import {Context} from 'moleculer';
import {ServiceSchema} from '../../ServiceSchema';
import {SessionService} from '../SessionService/SessionService';

/**
 * Creates new World sessions
 */
export class NewSessionService extends ServiceSchema {
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
        ctx.broker.createService(new SessionService(ctx.broker, {
            settings: {
                uuid: ctx.params.uuid,
                address: ctx.params.address,
            },
        }).schema());
    }
}
