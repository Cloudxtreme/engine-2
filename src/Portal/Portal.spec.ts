import {ServiceBroker} from 'moleculer';

import {DEFAULT_CONFIG, Portal} from './Portal';
import {TelnetService} from './TelnetService';

jest.mock('./TelnetService');

const mockBroker = new ServiceBroker();
mockBroker.createService = jest.fn();
console.log = jest.fn();

describe('Portal', () => {

    it('is sets the correct nodeID', () => {
        expect(Portal().nodeID).toEqual('lucid-portal');
    });

    it('sets validation to true', () => {
        expect(Portal().validation).toEqual(true);
    });

    describe('created', () => {
        it('creates a TelnetService', () => {
            Portal().created(mockBroker);
            expect(TelnetService).toHaveBeenCalledWith(DEFAULT_CONFIG);
            expect(mockBroker.createService).toHaveBeenCalledWith(TelnetService(DEFAULT_CONFIG));
        });
    });

    describe('configuration', () => {
        describe('redis', () => {
            it('sets the transporter to the default', () => {
                expect(Portal().transporter).toEqual(DEFAULT_CONFIG.transporter);
            });

            it('sets the transporter to whatever is passed in as the redis option', () => {
                expect(Portal({transporter: 'redis://notlocal'}).transporter).toEqual('redis://notlocal');
            });
        });

        describe('created', () => {
            it('calls the passed in created function', () => {
                const created = <Function>jest.fn();
                const schema = Portal({
                    created,
                });
                schema.created(mockBroker);
                expect(created).toHaveBeenCalled();
            });
        });

        describe('started', () => {
            it('calls the passed in started function', () => {
                const started = <Function>jest.fn();
                const schema = Portal({
                    started,
                });
                schema.started(mockBroker);
                expect(started).toHaveBeenCalled();
            });
        });

        describe('stopped', () => {
            it('calls the passed in started function', () => {
                const stopped = <Function>jest.fn();
                const schema = Portal({
                    stopped,
                });
                schema.stopped(mockBroker);
                expect(stopped).toHaveBeenCalled();
            });
        });
    });
});
