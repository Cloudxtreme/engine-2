import {ServiceEvents} from 'moleculer';

import {ISessionServiceMetadata} from '../../Portal/SessionService';
import {ServiceSchema} from '../../ServiceSchema';

/**
 * The World Loop is the primary processor for World events. It handles queued events from players, processes them, and
 * updates the state.
 */
export class WorldLoop extends ServiceSchema {
    protected readonly name: string = 'world.loop';

    protected readonly events: ServiceEvents = {
        'player.connected': this.playerConnected,
    };

    private playerConnected(payload: ISessionServiceMetadata) {
        this.logger.debug(`player connected on ${payload.remoteAddress}`);
    }
}
