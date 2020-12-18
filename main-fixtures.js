const { app, BrowserWindow } = require('electron');

app.once('browser-window-created', (event, window) => {
    const preferences = window.webContents.getLastWebPreferences();
    preferences.contextIsolation = false;
    preferences.nodeIntegration = true;
    preferences.webviewTag = true;
    preferences.enableRemoteModule = true;
    
    window.webContents.on('did-start-navigation', (event, url) => {
        event.preventDefault();
        const browserWindow = new BrowserWindow({
            show: false,
            webPreferences: preferences
        });
        browserWindow.loadURL(url, {
            userAgent: 'Electron ' + process.versions.electron + ' (Node ' + process.versions.node + ')'
        });
        window.destroy();
    });
});