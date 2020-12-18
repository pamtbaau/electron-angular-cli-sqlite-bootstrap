import { Hero } from './hero';
import { Settings } from './settings';
import { TheDb } from './thedb';

interface IGlobals {
    hero: Hero;
    heroId: number;
    name: string;
    count: number;
    newName: string;
}

describe('Hero', () => {
    // Using globs for sharing variables because using "this" for shared variables makes typescript compiler throw noImplicitAny errors
    const globals: IGlobals = {
        hero: new Hero(),
        heroId: 11,
        name: 'Mr. Nice',
        count: 5,
        newName: 'a silly name',
    };

    const insertHero = (): Promise<Hero> => {
        const hero = new Hero();
        hero.name = globals.newName;

        return hero.insert()
            .then(() => {
                return hero;
            });
    };

    beforeEach((done) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;

        Settings.initialize();
        TheDb.openDb(Settings.dbPath)
            .then(TheDb.resetDbKarma)
            .then(() => {
                return Hero.get(globals.heroId);
            })
            .then((hero) => {
                globals.hero = hero;
                done();
            })
            .catch((reason) => {
                throw reason;
            });
    });

    it('getHero()', (done) => {
        Hero.get(globals.heroId)
            .then((hero) => {
                expect(hero.name).toBe(globals.name);
                done();
            });
    });

    it('getHero(-1)', (done) => {
        Hero.get(-1)
            .catch((reason) => {
                expect(reason).toBeDefined();
                done();
            });
    });

    it('getHeroes()', (done) => {
        Hero.getAll()
            .then((heroes) => {
                expect(heroes.length).toBe(globals.count);
                done();
            });
    });

    it('insertHero()', (done) => {
        insertHero()
            .then((hero) => {
                return Hero.get(hero.id);
            })
            .then((insertedHero) => {
                expect(insertedHero.name).toBe(globals.newName);
                done();
            })
            .catch((reason) => {
                fail(reason);
                done();
            });
    });

    it('deleteHero()', (done) => {
        globals.hero.delete()
            .then(Hero.getAll)
            .then((heroes) => {
                const index = heroes.findIndex((item) => item.id === globals.heroId);
                expect(index).toBe(-1);
                done();
            })
            .catch((reason) => {
                expect(reason.message).toContain('Expected to get Hero transaction, found 0');
                done();
            });
    });
});
