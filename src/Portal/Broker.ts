// tslint:disable-next-line
import {ServiceBroker} from 'moleculer';
import {Options, RegEx, validate} from 'validate-typescript';
import {BrokerSchema} from '../BrokerSchema';

/**
 * The Portal provides the connection between the player's MUD client and the World.
 */
export namespace Portal {

    export class Broker extends BrokerSchema {
        get SERVICE_NAME() {
            return 'Portal';
        }
    }
}
