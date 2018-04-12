import {ISessionServiceSettings} from '../../Portal/SessionService';
import {ServiceSchema} from '../../ServiceSchema';

export class SessionService extends ServiceSchema {
    public serviceSettings: ISessionServiceSettings;

    get name() {
        return `world.sessions.${this.serviceSettings.uuid}`;
    }

}
