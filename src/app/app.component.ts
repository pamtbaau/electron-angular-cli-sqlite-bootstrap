import { Component } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';

// tslint:disable-next-line:no-implicit-dependencies
import { Menu, MenuItemConstructorOptions, OpenDialogOptions, remote, OpenDialogSyncOptions, SaveDialogSyncOptions } from 'electron';

import { Hero } from './model/hero';
import { Settings } from './model/settings';
import { TheDb } from './model/thedb';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
})
export class AppComponent {
    public heroes: Hero[];

    constructor() {
        Settings.initialize();

        if (fs.existsSync(Settings.dbPath)) {
            this.openDb(Settings.dbPath);
        } else if (Settings.hasFixedDbLocation) {
            this.createDb(Settings.dbPath);
        } else {
            this.createDb();
        }
    }

    public openDb(filename: string) {
        TheDb.openDb(filename)
            .then(() => {
                if (!Settings.hasFixedDbLocation) {
                    Settings.dbPath = filename;
                    Settings.write();
                }
            })
            .then(() => {
                this.getHeroes();
            })
            .catch((reason) => {
                // Handle errors
                console.log('Error occurred while opening database: ', reason);
            });
    }

    public async createDb(filename?: string) {
        if (!filename) {
            const options: SaveDialogSyncOptions = {
                title: 'Create file',
                defaultPath: remote.app.getPath('documents'),
                filters: [
                    {
                        name: 'Database',
                        extensions: ['db'],
                    },
                ],
            };
            filename = remote.dialog.showSaveDialogSync(remote.getCurrentWindow(), options);
        }

        if (!filename) {
            return;
        }

        TheDb.createDb(filename)
            .then((dbPath) => {
                if (!Settings.hasFixedDbLocation) {
                    Settings.dbPath = dbPath;
                    Settings.write();
                }
            })
            .then(() => {
                this.getHeroes();
            })
            .catch((reason) => {
                console.log(reason);
            });
    }

    public onRestoreDb() {
        TheDb.importJson(path.join(Settings.dbFolder, 'database.init.json'), false)
            .then(() => {
                this.getHeroes();
            });
    }

    public getHeroes() {
        Hero.getAll()
            .then((heroes) => {
                this.heroes = heroes;
            });
    }

    public onMenu(hero: Hero) {
        const menu = this.initMenu(hero);
        menu.popup({});
    }

    private deleteHero(hero: Hero) {
        hero.delete();
        this.getHeroes();
    }

    private initMenu(hero: Hero): Menu {
        const template: MenuItemConstructorOptions[] = [
            {
                label: `Delete ${hero.name}`,
                click: () => this.deleteHero(hero),
            },
        ];

        return remote.Menu.buildFromTemplate(template);
    }
}
