import {LoggerInstance, ServiceSchema} from 'moleculer';
import {Socket} from 'net';

export class SessionService implements ServiceSchema {
    public name: string;
    private readonly sessionId: string;
    private readonly socket: Socket;
    private readonly logger: LoggerInstance;

    constructor(sessionId: string, socket: Socket) {
        this.name = `player.${sessionId}`;
        this.sessionId = sessionId;
        this.socket = socket;
    }

    public created() {
        this.logger.debug('received connection');
    }

}
