import {ServiceEvents} from 'moleculer';
import {ServiceSchema} from '../../ServiceSchema';

class SessionService extends ServiceSchema {
    protected get name(): string {
        return `world.player.${this.metadata.uuid}`;
    }

    protected created(): void {
        this.logger.debug(`received connection from ${this.metadata.remoteAddress}`);
    }
}
