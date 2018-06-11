import {IObject} from '../../ObjectTypes/ObjectType/index';
import {App, IInputMessage} from '../App';

interface ICharacterData {
    name: string;
    template: string;
    character: IObject;
}

export const SelectCharacterApp = App({
    appName: 'SelectCharacterApp',
    started() {
        this.broker.call('data.object.findForPlayer', {
            player_id: this.metadata.playerId,
            object_type: 'Character',
        })
            .then((characters: [IObject]) => {
                if (characters.length > 0) {
                    const chars = characters.map((character: IObject, index: number) => {
                        return {
                            name: character.key,
                            template: `   ${index + 1}. ${character.key}\n`,
                            character,
                        };
                    });
                    //tslint:disable-next-line
                    let template: string = "Choose your character or type 'create' to create a new one:\n";
                    chars.forEach((character: ICharacterData) => {
                        template += character.template;
                    });

                    return this.sendToScreen(template);
                } else {
                    return this.switchApp('CreateCharacter');
                }
            });
    },
    handleInput(payload: IInputMessage) {
        if (payload.message === 'create') {
            return this.switchApp('CreateCharacter');
        }

        return this.broker.call('data.object.findForPlayer', {
            player_id: this.metadata.playerId,
            object_type: 'Character',
        })
            .then((characters: [IObject]) => {
                if (characters[<number>payload.message - 1]) {
                    this.sendToScreen(`You selected '${payload.message}'\n`);
                } else if (payload.message === 'create') {
                    return this.switchApp('CreateCharacter');
                } else {
                    this.sendToScreen('The selection was invalid.\n');

                    return this.started();
                }
            });
    },
});
