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
        // setup the tcp server
        this.server = net.createServer();
    }
    created() {
        // setup the TCP listener
        this.logger.debug('setting up tcp server');
        this.schema.server.on('listening', () => {
            this.logger.info(`listening on ${this.settings.host}`);
        });
        this.schema.server.on('connection', (socket) => {
            const sessionService = new SessionService_1.SessionService(uuid(), socket);
            this.broker.createService(sessionService);
        });
        const group = this.settings.host.match(HOST_REGEX);
        this.schema.server.listen({ host: group[1], port: group[2] });
    }
}
exports.TelnetService = TelnetService;
//# sourceMappingURL=TelnetService.js.map