import * as Bluebird from 'bluebird';
import {GenericObject} from 'moleculer';
import * as uuid from 'uuid';

import {ISessionMessageContext} from '../../Portal/SessionService';
import {ServiceSchema} from '../../ServiceSchema';
import {StateManager} from '../../StateManager';

export interface IPlayModeMessageContext {
    messageUuid: string;
    message: string;
    timestamp: number;
}

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

    public schema() {
        const schema = super.schema();

        return {
            ...schema,
            initialSate: this.initialState,
            methods: {
                ...schema.methods,
                onLoad: this.onLoad,
                sendToScreen: this.sendToScreen,
                callPortal: this.callPortal,
            },
            portalName: `portal.player.${this.metadata.uuid}`,
        };
    }

    protected get name(): string {
        return `world.player.${this.metadata.uuid}`;
    }

    public abstract inputHandler(inputContext: ISessionMessageContext): Bluebird<void>;

    /**
     * sends the provided string message to the player screen.
     * @param {String} message - the message to send to the player screen
     * @returns {Bluebird<Moleculer.GenericObject>}
     */
    public sendToScreen(message: string): Bluebird<GenericObject> {
        const msg: IPlayModeMessageContext = {
            messageUuid: <string>uuid.v1(),
            message,
            timestamp: Math.round((new Date()).getTime() / 1000),
        };

        return this.callPortal('sendToScreen', msg);
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
        //tslint:disable-next-line
        const sch = this.schema as GenericObject;
        return this.broker.call(`${sch.portalName}.${action}`, args);
    }

}
