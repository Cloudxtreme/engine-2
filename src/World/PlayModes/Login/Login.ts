// tslint:disable-next-line
import Bluebird from 'bluebird';
import {Context} from 'moleculer';
import {PlayMode} from '../PlayMode';

export class Login extends PlayMode {
    get metadata() {
        return {
            state: 0,
        };
    }

    public handleInput(ctx: Context): Promise<Context> {
        return new Promise((resolve: Function) => {
            resolve(ctx);
        });
    }

    public onLoad(): Bluebird<{}> {
        this.logger.debug('new connection, prompting for login');

        return this.sendToScreen('Welcome!');
    }
}
