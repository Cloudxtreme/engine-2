import {ServiceBroker} from 'moleculer';
import * as prettyJson from 'prettyjson';

import {BrokerSchema} from '../BrokerSchema';
import {WorldLoop} from './WorldLoop';

/**
 * The World process runs the game world. You can run as many world processes as you like, they will work together to
 * manage your game world allowing you to easily scale your game as time goes on.
 */
export class World extends BrokerSchema {
    protected readonly PROCESS_NAME: string = 'World';

    protected initialize() {
        this.beforeStart(this.createWorldLoopService);
        if (process.env.NODE_ENV !== 'test') {
            // tslint:disable
            console.log("Config:");
            console.log(prettyJson.render(this.config));
            console.log("---\n\n");
            console.log("Broker Schema:");
            console.log(prettyJson.render(this.schema()));
            console.log("---\n")
            //tslint:enable
        }
    }

    private createWorldLoopService(broker: ServiceBroker) {
        broker.createService(new WorldLoop(broker).schema());
    }
}
