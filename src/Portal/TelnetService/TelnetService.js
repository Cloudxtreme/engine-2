"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const HOST_REGEX = /tcp:\/\/(.+):(\d+)/;
/**
 * The TelnetService handles the initial connection from the player client.
 */
class TelnetService {
    constructor(config) {
        this.name = 'telnet';
        // Moleculer ServiceSchema allows for settings to be defined in the "settings" object.d
        this.settings = config;
        this.server = net.createServer();
        this.server.on('listening', () => {
            this.logger.info(`listening on ${this.settings.host}`);
        });
    }
    created() {
        // setup the TCP listener
        this.logger.debug('setting up tcp server');
        const group = this.settings.host.match(HOST_REGEX);
        this.server.listen({ host: group[1], port: group[2] });
    }
}
exports.TelnetService = TelnetService;
//# sourceMappingURL=TelnetService.js.map