import {LoggerInstance} from 'moleculer';
import {Socket} from 'net';
import {ServiceSchema} from '../../ServiceSchema';

export class SessionService extends ServiceSchema {
    private readonly sessionId: string;
    private readonly socket: Socket;

    constructor(sessionId: string, socket: Socket) {
        super();
        this.name = `player.${sessionId}`;
        this.sessionId = sessionId;
        this.socket = socket;
    }

    public created() {
        this.logger.debug('received connection');
    }

}
