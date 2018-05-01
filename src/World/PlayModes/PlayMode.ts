import * as Bluebird from 'bluebird';
import {GenericObject} from 'moleculer';
import * as uuid from 'uuid';

import {ServiceSchema} from '../../ServiceSchema';
import {StateManager} from '../../StateManager';

export abstract class PlayMode extends ServiceSchema {
    /**
     * The initial state for the play mode. This can be set to any data required by the PlayMode, and is not in any way
     * tied to world state or persisted.
     */
    public readonly initialState: {} = {};

    /**
     * The PlayMode's internal state manager. It is not in any way tied to the WorldState and does not persist.
     */
    public state: StateManager;

    protected get name(): string {
        return `world.player.${this.metadata.uuid}`;
    }

    protected get portalName(): string {
        return `portal.player.${this.metadata.uuid}`;
    }


    /**
     * sends the provided string message to the player screen.
     * @param {String} message - the message to send to the player screen
     * @returns {Bluebird<Moleculer.GenericObject>}
     */
    public sendToScreen(message: String): Bluebird<GenericObject> {
        return this.callPortal('sendToScreen', {
            uuid: uuid.v1(),
            message,
            timestamp: Math.round((new Date()).getTime() / 1000),
        });
    }

    /**
     * Overload this function when custom behavior needs to be implemented when the PlayMode starts. This is called
     * when the player is loaded into the PlayMode and it enters the ready state.
     */
    public onLoad(): void {
        return;
    }

    protected get dependencies(): String[] {
        return [
            `portal.player.${this.metadata.uuid}`,
        ];
    }

    protected created(): void {
        this.logger.debug(`received connection from ${this.metadata.remoteAddress}`);
        this.state = new StateManager(this.initialState);
    }

    protected started(): Bluebird<void> {
        return new Promise((resolve: Function) => {
            this.onLoad();
            resolve();

            return;
        });
    }

    protected callPortal<P extends GenericObject>(action: string, args: P | {} = {}): Bluebird<P> {
        return this.broker.call(`${this.portalName}.${action}`, args);
    }

}
