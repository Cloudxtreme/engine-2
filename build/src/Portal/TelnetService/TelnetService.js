"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const SessionService_1 = require("../SessionService");
const uuid = require("uuid/v4");
const HOST_REGEX = /tcp:\/\/(.+):(\d+)/;
class TelnetService {
    constructor(config) {
        this.name = 'telnet';
        this.settings = config;
    }
    created() {
        this.server = net.createServer();
        this.server.on('listening', () => {
            this.logger.info(`listening on ${this.settings.host}`);
        });
        this.server.on('connection', (socket) => {
            const sessionService = new SessionService_1.SessionService(uuid(), socket);
            this.broker.createService(sessionService);
        });
        this.logger.debug('setting up tcp server');
        const group = this.settings.host.match(HOST_REGEX);
        this.server.listen({ host: group[1], port: group[2] });
    }
}
exports.TelnetService = TelnetService;
//# sourceMappingURL=TelnetService.js.map