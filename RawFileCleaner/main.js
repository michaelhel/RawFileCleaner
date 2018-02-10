const electron = require('electron');
const path = require('path');
const url = require('url');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

//Starting App
app.on('ready', function(){
  mainWindow = new BrowserWindow({
    /*width: 800,
    height: 400,*/
      width: 2000,
      height: 800,
    resizable: false,
    fullscreen: false,
    titleBarStyle: 'hiddenInset',
    title:'RawFileCleaner'
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes:true
  }));

  //Closing app
  mainWindow.on('closed', function(){
    app.quit();
  });

  mainWindow.setMenu(null);
});
