// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
let mainWindow; // Keep a global reference of the window object


// When Electron has finished initialization and is ready
app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 1600, height: 900 });   // Create the browser window.
  mainWindow.loadURL(`file://${__dirname}/dist/angular-electron/index.html`)
  mainWindow.webContents.openDevTools();  // Open the DevTools.
  mainWindow.on('closed', function () { // Emitted when the window is closed.
    mainWindow = null
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', async () => {
  await client.end();
  if (process.platform !== 'darwin') { app.quit(); } // macOS force
});

app.on('activate', () => {
  if (mainWindow === null) { createWindow(); } // macOS
});



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// ------------------------------------------------------------------ \\
// Listen to the render process to start the session and get the
// credentials for the web API
// ------------------------------------------------------------------ \\
const {ipcMain} = require('electron');
ipcMain.on('ping', function(event, params) {
  console.log('Server side request');

  setTimeout(() => {
    console.log('Sending async response');
    event.sender.send('pong', { msg: 'ok' });
  }, 4000);

  event.returnValue = 'pong response';
});


const { Client } = require('pg');
const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'barba',
  password: 'barba0001',
  database: 'CTB_DOM'
});
var connectPromise = client.connect();

// Get acc_pots
ipcMain.on('acc_pots:get', async (event, params) => {
  console.log('Getting acc pots');

  await connectPromise;

  var paramsSql = [];
  var querySql =
   'select t1.id          as id, '
  + '      t1.pos         as pos, '
  + '      t1.name        as name, '
  + '      t1.amount      as amount, '
  + '      t1.parent_id   as parent_id '
  + ' from acc_pots t1 ';

  const result = await client.query(querySql, paramsSql)
  event.sender.send('acc_pots:get:response', { result: result.rows });
  console.log('sending back result:', result.rows.length);
  // await client.end()
});
