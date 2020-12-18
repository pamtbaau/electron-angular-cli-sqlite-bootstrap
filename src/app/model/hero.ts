import { TheDb } from './thedb';

/**
 * Simple class for selecting, inserting, updating and deleting Heroes in hero table.
 *
 * @export
 * @class Hero
 */
export class Hero {
    public id = -1;
    public name = '';

    public static get(id: number): Promise<Hero> {
        const sql = 'SELECT * FROM hero WHERE id = $id';
        const values = { $id: id };

        return TheDb.selectOne(sql, values)
            .then((row) => {
                if (row) {
                    return new Hero().fromRow(row);
                } else {
                    throw new Error('Expected to find 1 Hero. Found 0.');
                }
            });
    }

    public static getAll(): Promise<Hero[]> {
        const sql = `SELECT * FROM hero ORDER BY name`;
        const values = {};

        return TheDb.selectAll(sql, values)
            .then((rows) => {
                const heroes: Hero[] = [];
                for (const row of rows) {
                    const hero = new Hero().fromRow(row);
                    heroes.push(hero);
                }
                return heroes;
            });
    }

    public insert(): Promise<void> {
        const sql = `
            INSERT INTO hero (name)
            VALUES($name)`;

        const values = {
            $name: this.name,
        };

        return TheDb.insert(sql, values)
            .then((result) => {
                if (result.changes !== 1) {
                    throw new Error(`Expected 1 Hero to be inserted. Was ${result.changes}`);
                } else {
                    this.id = result.lastID;
                }
            });
    }

    public update(): Promise<void> {
        const sql = `
            UPDATE hero
               SET name = $name
             WHERE id = $id`;

        const values = {
            $name: this.name,
        };

        return TheDb.update(sql, values)
            .then((result) => {
                if (result.changes !== 1) {
                    throw new Error(`Expected 1 Hero to be updated. Was ${result.changes}`);
                }
            });
    }

    public delete(): Promise<void> {
        const sql = `
            DELETE FROM hero WHERE id = $id`;

        const values = {
            $id: this.id,
        };

        return TheDb.delete(sql, values)
            .then((result) => {
                if (result.changes !== 1) {
                    throw new Error(`Expected 1 Hero to be deleted. Was ${result.changes}`);
                }
            });
    }

    public fromRow(row: object): Hero {
        this.id = row['id'];
        this.name = row['name'];

        return this;
    }
}
