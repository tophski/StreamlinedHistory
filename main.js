const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
indexPdf = require("./indexer.js");
classify = require("./classify.js");

const path = require('path');
const url = require('url');
const ipc = require('electron').ipcMain;

//console.log("hello")
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
//  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipc.on('buttonClicked', function(event, arg){
    var file = arg[0];
    var startPage = arg[1];
    var endPage = arg[2];

    ipc.on('displayReady', (event, arg) => {
        indexPdf("./"+file, parseInt(startPage), parseInt(endPage)).then(sentences => {
            let timelineData = classify(sentences);

            console.log('Sending ' + timelineData.length + " timeline items...");
            event.sender.send('timelineData', timelineData);
            console.log('Sent.')
        });
    });

    event.sender.send('received', null);
});




/*
//testing for display.js
ipc.on("reply", function(event, arg){
 json=[{date: "1546", sentence: "This is a sentence", page: "34"},
  {date: "1436", sentence: "This is a verrrrrrrrrrry biggggggggggggggggg sentence", page: "34"},
  {date: "1136", sentence: "This is a verrrrrrrrrrry biggggggggggggggggg sentence", page: "34"},
  {date: "1336", sentence: "This is a verrrrrrrrrrry biggggggggggggggggg sentence", page: "34"}
];
event.sender.send('timelineData', json)

});
*/

function testQuery(query){
  index = require('./indexer')('./sample.pdf');
  index.then(function(index){
    let results = index.search(query);
    console.log(results)
  });
}

function testIndexer(){
    indexPdf("./pdfs/irish.pdf", 9, 217).then(sentences => {
      dates = classify(sentences);
    });
}
