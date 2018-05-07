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

process.env.GAME_ROOT = path.resolve('./example');

const mockBroker = new ServiceBroker();

describe('Player', () => {
    let playerService;
    beforeEach(() => {
        // tslint:disable-next-line
        playerService = new Service(mockBroker, DataService(Player(<IWorldConfig>{})));
        playerService.created();
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
    });
});
