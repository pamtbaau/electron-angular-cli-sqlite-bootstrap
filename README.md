# Please do not use this starterkit. It is no longer maintained.
<br />
<br />

# Sample application using Angular CLI 11+, Electron 11+, SQLite3 5+ and Bootstrap 4+

This repository contains a simple Electron/Angular starter application, using Angular CLI 10+, Electron 10+, SQLite 5+, and Bootstrap 4+. It is very similar to the other [Electron/Angular starter](https://github.com/pamtbaau/electron-angular-sqlite-bootstrap-webpack) which does not use Angular CLI, and builds using Webpack.

In early days of Angular-CLI, custom Webpack definitions were near impossible. Therefore, I stayed away from CLI. However, nowadays, there are more posiblities for finetuning the internal Webpack definition using [@angular-builders/custom-webpack](https://www.npmjs.com/package/@angular-builders/custom-webpack). Using this package, one can add/replace Webpack configurations making integration of SQLite with Electron easier.

**Notes**
- e2e is not yet working
- Since I develop solely on Windows 10, I have not tested the application on any Unix version.

## Prerequisites (Windows 10)
Both Visual C++ Build Tools and Python 2.7 are required for [node-gyp](https://github.com/nodejs/node-gyp) to rebuild native SQLite library for node.<br />
For installation instructions see [node-gyp](https://github.com/nodejs/node-gyp).

## Quickstart
 1. git clone https://github.com/pamtbaau/electron-angular-cli-sqlite-bootstrap.git
 1. npm install
 1. npm run build:once
 1. npm start
    - Enter new database name in file dialog.

## Karma tests
 - npm run test

## Building installable exe
 - npm run package

## Notes
- Application can switch between a fixed database location or allow the end-user to select a location at first startup.<br />
  See src/app/model/Settings.hasFixedDbLocation
- When allowing the user to choose location/name of database, a `settings.json` (points to database location) is located in `c:/users/yourname/AppData/Roaming/$productName}-dev`<br />
When running packaged executable, `settings.json` is located in `c:/users/yourname/AppData/Roaming/$productName}`. This way development will not override production data.
- TheDb provides a Promise-ified wrapper around bare sqlite3 API.
