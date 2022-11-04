// Module to control the application lifecycle and the native browser window.
const { app, BrowserWindow, ipcMain, protocol, shell } = require("electron");
const path = require("path");
const url = require("url");
require("dotenv").config();
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
const { autoUpdater } = require("electron-updater");

const fs = require('fs');

let mainWindow;
// Create the native browser window.
function createWindow() {
    fs.appendFileSync('C:\\Users\\isaac\\log.txt', 'createWindow\n')
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        // Set the path of an additional "preload" script that can be used to
        // communicate between node-land and browser-land.
        webPreferences: {
            title: "Scene",
            preload: path.join(__dirname, "preload.js"),
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false
        },
    });

    // Open external links in other browsers (i.e. target="_blank").
    const ses = mainWindow.webContents.session;
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        return shell.openExternal(url)
    })

    getAuth().then((res) => {
        fs.appendFileSync('C:\\Users\\isaac\\log.txt', 'getAuthCallback\n')
        // Rewrite cookies for the ship since Urbit doesn't do this and Chromium needs it.
        if (res?.url || process.env.REACT_APP_URL) {
            ses.webRequest.onHeadersReceived(
                { urls: [`${res?.url || process.env.REACT_APP_URL}/*/*`] },
                (details, callback) => {
                    if (
                        details.responseHeaders &&
                        details.responseHeaders['set-cookie'] &&
                        details.responseHeaders['set-cookie'].length &&
                        !details.responseHeaders['set-cookie'][0].includes('SameSite=none')
                    ) {
                        details.responseHeaders['set-cookie'][0] = details.responseHeaders['set-cookie'][0] + '; SameSite=none; Secure';
                    }
                    callback({ cancel: false, responseHeaders: details.responseHeaders });
                },
            );
        }
    });

    // Register our protocol, scene://.
    if (process.defaultApp) {
        if (process.argv.length >= 2) {
            app.removeAsDefaultProtocolClient('scene', process.execPath, [path.resolve(process.argv[0])]);
            app.setAsDefaultProtocolClient('scene', process.execPath, [path.resolve(process.argv[0])])
        }
    } else {
        app.removeAsDefaultProtocolClient('scene');
        app.setAsDefaultProtocolClient('scene')
    }

    // In production, set the initial browser path to the local bundle generated
    // by the Create React App build process.
    // In development, set it to localhost to allow live/hot-reloading.
    const appURL = app.isPackaged
        ? url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file:",
            slashes: true,
        })
        : "http://localhost:3000";
    mainWindow.loadURL(appURL);

    // Automatically open Chrome's DevTools in development mode.
    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools();
    }
}

async function getAuth() {
    fs.appendFileSync('C:\\Users\\isaac\\log.txt', 'getAuth 2\n')
    const deepLink = process.argv.find((arg) => arg.startsWith('scene://'));
    fs.appendFileSync('C:\\Users\\isaac\\log.txt', 'after deepLink\n')

    var newAuth = null;
    if (deepLink) {
      fs.appendFileSync('C:\\Users\\isaac\\log.txt', `hasDeepLink ${deepLink}\n`)
      const params = new URL(deepLink).searchParams;

      if (params.has('patp') && params.has('code') && params.has('url')) {
        fs.appendFileSync('C:\\Users\\isaac\\log.txt', `hasParams ${params}\n`)

        newAuth = {
          ship: params.get('patp'),
          code: params.get('code'),
          url: params.get('url'),
        }

        if (newAuth.ship.startsWith('~')) {
            newAuth.ship = newAuth.ship.replace(/^~/, '');
            fs.appendFileSync('C:\\Users\\isaac\\log.txt', `sig\n`)
        }
        if (!newAuth.url.startsWith('https://')) {
            fs.appendFileSync('C:\\Users\\isaac\\log.txt', `https\n`)
            if (/^(?:.*:\/\/)/.test(newAuth.url)) {
                fs.appendFileSync('C:\\Users\\isaac\\log.txt', `https 2\n`)
                // starts with some other protocol like http? replace it with https
                newAuth.url = newAuth.url.replace(/^(?:.*:\/\/)/, 'https://')
            } else {
                fs.appendFileSync('C:\\Users\\isaac\\log.txt', `https 3\n`)
                // doesn't start with a protocol but it should
                newAuth.url = `https://${newAuth.url}`
            }
        }

        fs.appendFileSync('C:\\Users\\isaac\\log.txt', `good Munging\n`)

      } else {
        fs.appendFileSync('C:\\Users\\isaac\\log.txt', `badDeepLink ${deepLink}\n`)
        throw new Error(`bad deep link ${deepLink}`)
      }
    } else {
      fs.appendFileSync('C:\\Users\\isaac\\log.txt', `noDeepLink\n`)
    }
    if (newAuth) {
      const oldStorage = await mainWindow.webContents.executeJavaScript(`window.localStorage.getItem("tirrel-desktop-auth")`);
      if (oldStorage === JSON.stringify(newAuth)) {
        fs.appendFileSync('C:\\Users\\isaac\\log.txt', `we good\n`)
        return newAuth;
      }

      fs.appendFileSync('C:\\Users\\isaac\\log.txt', `newAuth ${JSON.stringify(newAuth)}\n`)
      await mainWindow.webContents.executeJavaScript(`window.localStorage.setItem("tirrel-desktop-auth", '${JSON.stringify(newAuth)}')`);  // note security vulnerability
      const newArgs = process.argv.filter((arg) => !arg.startsWith('scene://'));
      fs.appendFileSync('C:\\Users\\isaac\\log.txt', `oldArgs ${process.argv}\n`)
      fs.appendFileSync('C:\\Users\\isaac\\log.txt', `newArgs ${newArgs}\n`)
      app.relaunch({ args: newArgs });
      app.quit(0);
    } else {
      const storage = await mainWindow.webContents.executeJavaScript(`window.localStorage.getItem("tirrel-desktop-auth")`);
      fs.appendFileSync('C:\\Users\\isaac\\log.txt', `oldAuth ${storage} \n`)
      return storage ? JSON.parse(storage) : {};
    }
}

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
    protocol.registerHttpProtocol(
        "file",
        (request, callback) => {
            const url = request.url.substr(8);
            callback({ path: path.normalize(`${__dirname}/${url}`) });
        },
        (error) => {
            if (error) console.error("Failed to register protocol");
        }
    );
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (e, argv, workingDirectory) => {
        fs.appendFileSync('C:\\Users\\isaac\\log.txt', 'second-instance\n')
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
        if (process.platform !== 'darwin') {
            // Find the arg that is our custom protocol url and store it
            const deepLink = argv.find((arg) => arg.startsWith('scene://'));
            if (deepLink) {
                fs.appendFileSync('C:\\Users\\isaac\\log.txt', 'deepLink\n')
                mainWindow.webContents.send('deepLink', deepLink);
            }
        }
    });

    app.whenReady().then(async () => {
        fs.appendFileSync('C:\\Users\\isaac\\log.txt', 'whenReady\n')
        installExtension(REACT_DEVELOPER_TOOLS)
            .then((name) => console.log(`Added Extension:  ${name}`))
            .catch((err) => console.log('An error occurred: ', err));
        setupLocalFilesNormalizerProxy();
        // check once on startup and then again every half hour
        autoUpdater.checkForUpdatesAndNotify();
        setInterval(() => autoUpdater.checkForUpdatesAndNotify(), 1800000);
    });
    app.on('ready', async () => {
        fs.appendFileSync('C:\\Users\\isaac\\log.txt', 'ready\n')
        createWindow();
        app.on("activate", function async() {
            fs.appendFileSync('C:\\Users\\isaac\\log.txt', 'activate\n')
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
        if (process.platform !== 'darwin') {
            // Find the arg that is our custom protocol url and store it
            const deepLink = argv.find((arg) => arg.startsWith('scene://'));
            if (deepLink) {
                fs.appendFileSync('C:\\Users\\isaac\\log.txt', 'deepLink\n')
                mainWindow.webContents.send('deepLink', deepLink);
            }
        }
    })
    app.on('open-url', (event, url) => {
        fs.appendFileSync('C:\\Users\\isaac\\log.txt', 'open-url\n')
        mainWindow.webContents.send('deepLink', url);
    })
}

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// See src/components/Onboarding/confirm.js.
// We respawn the app once we set the cookies so that we relaunch into the desktop.
ipcMain.on('respawn', () => {
    fs.appendFileSync('C:\\Users\\isaac\\log.txt', 'respawn\n')
    app.relaunch();
    app.quit(0);
})
