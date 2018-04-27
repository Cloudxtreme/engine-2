import {GenericObject, ServiceEvents} from 'moleculer';
import {ServiceSchema} from '../../ServiceSchema';

export class PlayMode extends ServiceSchema {
    protected get name(): string {
        return `world.player.${this.metadata.uuid}`;
    }

    protected get dependencies(): String[] {
        return [
            `portal.player.${this.metadata.uuid}`,
        ];
    }

    protected created(): void {
        this.logger.debug(`received connection from ${this.metadata.remoteAddress}`);
    }

}
