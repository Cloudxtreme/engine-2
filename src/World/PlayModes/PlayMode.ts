// tslint:disable-next-line
import Bluebird from 'bluebird';
import {Context} from 'moleculer';

import {IMessage} from '../../Portal/SessionService';
import {ServiceSchema} from '../../ServiceSchema';

interface IPlayModeSettings {
    uuid: string;
}

export abstract class PlayMode extends ServiceSchema {
    public serviceSettings: IPlayModeSettings;
    public settings: IPlayModeSettings;

    get methods() {
        return {
            handleInput: this.handleInput,
            onLoad: this.onLoad,
            sendToScreen: this.sendToScreen,
        };
    }

    get actions() {
        return {
            send: this.handleInput,
        };
    }

    get name() {
        return `world.sessions.${this.serviceSettings.uuid}`;
    }

    public abstract handleInput(ctx: Context): Promise<Context>;

    public onLoad(): Bluebird<{}> {
        return new Promise((resolve: Function) => resolve());
    }

    public sendToScreen(message: string): Bluebird<{}> {
        return this.broker.waitForServices([`portal.sessions.${this.settings.uuid}`], 0, 100)
            .then(() => {
                this.logger.debug(`sending message to portal '${message}'`);

                return this.broker.call(`portal.sessions.${this.settings.uuid}.sendToScreen`, {message});
            });
    }

    public created(): Bluebird<{}> {
        this.logger.debug('calling onload');

        return this.onLoad();
    }
}
