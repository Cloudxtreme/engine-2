import * as faker from 'faker';
import {ServiceBroker} from 'moleculer';

import {StateManager} from '../../../StateManager';
import {Signup} from './Signup';

const mockBroker = new ServiceBroker();
mockBroker.call = jest.fn();

describe('Signup', () => {
    let app;
    let mockService;
    beforeEach(() => {
        app = Signup;
        mockService = {
            sendStepText: Signup.methods.sendStepText,
            state: new StateManager({
                currentStep: 0,
            }),
            sendToScreen: jest.fn(),
        };
    });

    describe('started', () => {
        it('calls sendToScreen with the correct prompt', () => {
            Signup.started.bind(mockService)();
            expect(mockService.sendToScreen).toHaveBeenCalledWith('Choose a username:');
        });
    });

    describe('handleInput', () => {
        describe('currentStep = 0', () => {

            it('sets the input to username', () => {
                const name = faker.name.findName();
                Signup.handleInput.bind(mockService)({message: name});
                expect(mockService.state.getIn('username')).toBe(name);
            });

            it('sets the currentStep to 1', () => {
                const name = faker.name.findName();
                Signup.handleInput.bind(mockService)({message: name});
                expect(mockService.state.getIn('currentStep')).toBe(1);
            });

            it('calls sendToSccreen with the correct output', () => {
                const name = faker.name.findName();
                Signup.handleInput.bind(mockService)({message: name});
                expect(mockService.sendToScreen).toHaveBeenCalledWith('Choose a password:');
            });

        });

        describe('handleInput', () => {

            describe('currentStep = 1', () => {
                beforeEach(() => {
                    mockService = {
                        sendStepText: Signup.methods.sendStepText,
                        state: new StateManager({
                            currentStep: 1,
                        }),
                        sendToScreen: jest.fn(),
                    };
                });

                it('sets the input to username', () => {
                    const name = faker.name.findName();
                    Signup.handleInput.bind(mockService)({message: name});
                    expect(mockService.state.getIn('password')).toBe(name);
                });

                it('sets the currentStep to 1', () => {
                    const name = faker.name.findName();
                    Signup.handleInput.bind(mockService)({message: name});
                    expect(mockService.state.getIn('currentStep')).toBe(2);
                });

                it('calls sendToScreen with the correct output', () => {
                    const name = faker.name.findName();
                    Signup.handleInput.bind(mockService)({message: name});
                    expect(mockService.sendToScreen).toHaveBeenCalledWith('Confirm your password:');
                });

            });
        });

        describe('currentStep = 0', () => {

            it('sets the input to username', () => {
                const name = faker.name.findName();
                Signup.handleInput.bind(mockService)({message: name});
                expect(mockService.state.getIn('username')).toBe(name);
            });

            it('sets the currentStep to 1', () => {
                const name = faker.name.findName();
                Signup.handleInput.bind(mockService)({message: name});
                expect(mockService.state.getIn('currentStep')).toBe(1);
            });

            it('calls sendToSccreen with the correct output', () => {
                const name = faker.name.findName();
                Signup.handleInput.bind(mockService)({message: name});
                expect(mockService.sendToScreen).toHaveBeenCalledWith('Choose a password:');
            });

            describe('currentStep = 2', () => {
                const password = faker.name.findName();
                beforeEach(() => {
                    mockService = {
                        sendStepText: Signup.methods.sendStepText,
                        state: new StateManager({
                            currentStep: 2,
                            password,
                        }),
                        sendToScreen: jest.fn(),
                        broker: mockBroker,
                    };
                });

                describe('invalid confirmation', () => {
                    it('sets the step back to 0', () => {
                        const confirmation = faker.name.findName();
                        Signup.handleInput.bind(mockService)({message: confirmation});
                        expect(mockService.state.getIn('currentStep')).toBe(1);
                    });

                    it('calls sendToScreen with the correct output for a mismatched confirmation', () => {
                        const confirmation = faker.name.findName();
                        Signup.handleInput.bind(mockService)({message: confirmation});
                        expect(mockService.sendToScreen).toHaveBeenCalledWith(
                            'The password and confirmation must match!\n',
                        );
                    });

                    it('calls sendToScreen with the correct output', () => {
                        const confirmation = faker.name.findName();
                        Signup.handleInput.bind(mockService)({message: confirmation});
                        expect(mockService.sendToScreen).toHaveBeenCalledWith('Choose a password:');
                    });
                });

                describe('valid confirmation', () => {
                    it('calls the player service with create with the username and password', () => {
                        Signup.handleInput.bind(mockService)({message: password});
                        expect(mockService.broker.call).toHaveBeenCalledWith('data.player.create', {
                            username: mockService.state.getIn('username'),
                            password: mockService.state.getIn('password'),
                        });
                    });
                });
            });
        });
    });
});
