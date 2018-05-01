import {PlayMode} from './PlayMode';

interface ILoginState {
    currentStep: number;
    usernanme?: string;
}

/**
 * Handles the initial login of the user.
 */
export class LoginPlayMode extends PlayMode {
    public get initialState(): ILoginState {
        return {
            currentStep: 1,
        };
    }

    public onLoad(): void {
        this.sendToScreen('Lucid Mud');
    }
}
