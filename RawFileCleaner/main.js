const electron = require('electron');
const path = require('path');
const url = require('url');

const {
    app,
    BrowserWindow,
    Menu
} = electron;

let mainWindow;

//Starting App
app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 400,
        //frame: false,
        resizable: false,
        fullscreen: false,
        titleBarStyle: 'hiddenInset',
        title: 'RawFileCleaner',
        backgroundColor: '#282C34'
    });


    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'selectSource.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Closing app
    mainWindow.on('closed', function() {
        app.quit();
    });

    mainWindow.setMenu(null);
});