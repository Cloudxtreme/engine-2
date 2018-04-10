"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const HOST_REGEX = /tcp:\/\/(.+):(\d+)/;
class TelnetService {
    constructor(config) {
        this.name = 'telnet';
        this.settings = config;
    }
    created() {
        this.logger.debug('setting up tcp server');
        const group = this.settings.host.match(HOST_REGEX);
        this.server = net.createServer();
        this.server.on('listening', () => {
            this.logger.info(`listening on ${this.settings.host}`);
        });
        this.server.listen({ host: group[1], port: group[2] });
    }
}
exports.TelnetService = TelnetService;
//# sourceMappingURL=TelnetService.js.map