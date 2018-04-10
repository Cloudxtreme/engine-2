"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const SessionService_1 = require("../SessionService");
// tslint:disable
const uuid = require("uuid/v4");
// tslint:enable
const HOST_REGEX = /tcp:\/\/(.+):(\d+)/;
/**
 * The TelnetService handles the initial connection from the player client.
 */
class TelnetService {
    constructor(config) {
        this.name = 'telnet';
        // Moleculer ServiceSchema allows for settings to be defined in the "settings" object.d
        this.settings = config;
    }
    created() {
        // setup the tcp server
        this.server = net.createServer();
        this.server.on('listening', () => {
            this.logger.info(`listening on ${this.settings.host}`);
        });
        this.server.on('connection', (socket) => {
            const sessionService = new SessionService_1.SessionService(uuid(), socket);
            this.broker.createService(sessionService);
        });
        // setup the TCP listener
        this.logger.debug('setting up tcp server');
        const group = this.settings.host.match(HOST_REGEX);
        this.server.listen({ host: group[1], port: group[2] });
    }
}
exports.TelnetService = TelnetService;
//# sourceMappingURL=TelnetService.js.map