"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const uuid = require("uuid");
const ServiceSchema_1 = require("../../ServiceSchema");
const SessionService_1 = require("../SessionService");
const HOST_REGEX = /tcp:\/\/(.+):(\d+)/;
class TelnetService extends ServiceSchema_1.ServiceSchema {
    constructor() {
        super(...arguments);
        this.name = 'portal.telnet';
        this.methods = {
            listening: this.listening,
            createSession: this.createSession,
        };
    }
    created() {
        this.server = net.createServer();
        this.logger.debug('setting up tcp server');
        this.server.on('listening', this.listening);
        this.server.on('connection', this.createSession);
        const group = this.settings.host.match(HOST_REGEX);
        this.server.listen({ host: group[1], port: group[2] });
    }
    listening() {
        this.logger.info(`listening on ${this.settings.host}`);
    }
    createSession(socket) {
        const sessionService = new SessionService_1.SessionService(this.broker, socket, {
            metadata: {
                uuid: uuid.v1(),
                remoteAddress: socket.remoteAddress,
            },
        });
        this.broker.createService(sessionService.schema());
    }
}
exports.TelnetService = TelnetService;
//# sourceMappingURL=TelnetService.js.map