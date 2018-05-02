import * as Bluebird from 'bluebird';

import {ISessionMessageContext} from '../../Portal/SessionService/SessionService';
import {PlayMode} from './PlayMode';

interface ILoginState {
    currentStep: number;
    username?: string;
}

/**
 * Handles the initial login of the user.
 */
export class LoginPlayMode extends PlayMode {
    public initialState: ILoginState = {
        currentStep: 1,
    };

    public inputHandler(inputContext: ISessionMessageContext): Bluebird<void> {
        return new Promise((resolve: Function) => {
            switch (this.state.getIn('currentStep')) {
                case(1):
                    this.state.setIn('username', inputContext.message);
                    resolve();
                    break;
                case(2):
                    resolve();
                    break;
                default:
                    this.logger.error('invalid state');
            }
        });
    }

    public onLoad(): void {
        this.sendToScreen('Lucid Mud');
        this.sendToScreen('Username:');
    }
}
