import {App, IInputMessage} from '../App';

export const CreateCharacterApp = App({
    appName: 'CreateCharacter',
    initialState: {
        currentStep: 0,
    },
    handleInput(payload: IInputMessage) {
        const currentStep = this.state.getIn('currentStep');
        // tslint:disable-next-line:switch-default
        switch (currentStep) {
            case 1:
                this.broker.call('world.objects.buildAndCreate', {
                        object_type: 'Character',
                        key: payload.message,
                        player_id: this.metadata.playerId,
                        playerUuid: payload.uuid,
                    },
                );
        }

        return this.sendNextStep();
    },
    started() {
        return this.sendNextStep();
    },
    methods: {
        sendNextStep() {
            const currentStep = this.state.getIn('currentStep');
            // tslint:disable-next-line:switch-default
            switch (currentStep) {
                case 0:
                    this.state.setIn('currentStep', 1);
                    this.sendToScreen('Name your character:\n');
            }
        },
    },
});
