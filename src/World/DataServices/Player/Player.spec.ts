import * as bcrypt from 'bcrypt';
import * as faker from 'faker';
import * as knexCleaner from 'knex-cleaner';

import {
    Service,
    ServiceBroker,
} from 'moleculer';
import * as path from 'path';

import {IWorldConfig} from '../../World';
import {DataService} from '../DataService';
import {IPlayer, Player} from './Player';

process.env.GAME_ROOT = path.resolve(path.join(__dirname, '..', '..', '..', '..', 'example'));

const mockBroker = new ServiceBroker();

describe('Player', () => {
    let playerService;
    beforeEach(() => {
        // tslint:disable-next-line
        playerService = new Service(mockBroker, DataService(Player(<IWorldConfig>{})));
        playerService.created();
    });

    afterEach(() => {
        playerService.db.destroy();
    });

    describe('create', () => {
        it('creates a player record', () => {
            return knexCleaner.clean(playerService.db)
                .then(() => {
                    return playerService.actions.create({username: faker.internet.userName(), password: 'bar'});
                })
                .then(() => {
                    return playerService.db.select('*').from('players').first();
                })
                .then((results: IPlayer) => {
                    expect(results).not.toBeUndefined();
                });
        });

        it('adds a uuid', () => {
            return knexCleaner.clean(playerService.db)
                .then(() => {
                    return playerService.actions.create({username: faker.internet.userName(), password: 'bar'});
                })
                .then(() => {
                    return playerService.db.select('*').from('players').first();
                })
                .then((results: IPlayer) => {
                    expect(results.uuid).not.toBeUndefined();
                });
        });

        it('sets the username', () => {
            const username = faker.internet.userName();

            return knexCleaner.clean(playerService.db)
                .then(() => {
                    return playerService.actions.create({username, password: 'bar'});
                })
                .then(() => {
                    return playerService.db.select('*').from('players').first();
                })
                .then((results: IPlayer) => {
                    expect(results.username).toBe(username);
                });
        });

        it('sets the password to the correct hash',  () => {
            const username = faker.internet.userName();

            return knexCleaner.clean(playerService.db)
                .then(() => {
                    return playerService.actions.create({username, password: 'bar'});
                })
                .then(() => {
                    return playerService.db.select('*').from('players').first();
                })
                .then((results: IPlayer) => {
                    return bcrypt.compare('bar', results.password);
                })
                .then((result: boolean) => {
                    expect(result).toBe(true);
                });
        });
    });

    describe('authenticate', () => {
        it('returns true for a valid password', () => {
            const username = faker.internet.userName();

            return playerService.actions.create({username, password: 'bar'})
                .then(() => (
                    playerService.authenticate(username, 'bar')
                ))
                .then((result: boolean) => {
                    expect(result).toBeTruthy();
                });
        });

        it('returns false for an invalid password', () => {
            const username = faker.internet.userName();

            return playerService.actions.create({username, password: 'bar'})
                .then(() => (
                    playerService.authenticate(username, 'baz')
                ))
                .then((result: boolean) => {
                    expect(result).toBeFalsy();
                });
        });
    });
});
