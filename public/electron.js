// Module to control the application lifecycle and the native browser window.
const {
    app,
    BrowserWindow,
    ipcMain,
    protocol,
    screen,
    shell,
} = require("electron");
const path = require("path");
const url = require("url");
require("dotenv").config();
const log = require("electron-log");
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
const { autoUpdater } = require("electron-updater");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

const WIN_OR_MAC = process.platform === 'darwin' || process.platform === 'win32';

let mainWindow;
let dl_url;
// Create the native browser window.
function createWindow(dl_url) {
    const mainScreen = screen.getPrimaryDisplay();
    mainWindow = new BrowserWindow({
        width: mainScreen.size.width,
        height: mainScreen.size.height,
        minWidth: WIN_OR_MAC ? 800 : undefined,
        minHeight: WIN_OR_MAC ? 600 : undefined,
        backgroundColor: 'black',
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

    //Disable the menu at the top of the window if not on macos
    process.platform !== 'darwin' && mainWindow.setMenu(null);

    // Open external links in other browsers (i.e. target="_blank").
    const ses = mainWindow.webContents.session;
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.includes(("/apps/talk")) || url.includes(("/apps/groups"))) {
            mainWindow.webContents.executeJavaScript(`window.scene.linkToWindow("${url}")`);
            return {
                action: "deny"
            }
        }
        shell.openExternal(url)
        return {
            action: "deny"
        }
    })

    getAuth(dl_url).then((res) => {
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

app.on('open-url', (event, url) => {
    if (mainWindow) {
        event.preventDefault();
        mainWindow.webContents.send('deepLink', url);
    } else {
        dl_url = url;
    }
})

async function getAuth(dl_url) {
    const deepLink = dl_url || process.argv.find((arg) => arg.startsWith('scene://'));

    let newAuth;
    if (deepLink) {
        const params = new URL(deepLink).searchParams;
        if (params.has('patp') && params.has('code') && params.has('url')) {
            newAuth = {
                code: params.get('code'),
                url: params.get('url'),
            }
            if (!newAuth.url.startsWith('https://')) {
                if (/^(?:.*:\/\/)/.test(newAuth.url)) {
                    // starts with some other protocol like http? replace it with https
                    newAuth.url = newAuth.url.replace(/^(?:.*:\/\/)/, 'https://')
                } else {
                    // doesn't start with a protocol but it should
                    newAuth.url = `https://${newAuth.url}`
                }
            }
        } else {
            throw new Error(`bad deep link ${deepLink}`)
        }
    } else {
    }
    if (newAuth) {
        const oldStorage = await mainWindow.webContents.executeJavaScript(`window.localStorage.getItem("tirrel-desktop-auth")`);
        if (oldStorage === JSON.stringify(newAuth)) {
            return newAuth;
        }

        await mainWindow.webContents.executeJavaScript(`window.localStorage.setItem("tirrel-desktop-auth", '${JSON.stringify(newAuth)}')`);  // note security vulnerability
        const newArgs = process.argv.filter((arg) => !arg.startsWith('scene://'));
        app.relaunch({ args: newArgs });
        app.quit(0);
    } else {
        const storage = await mainWindow.webContents.executeJavaScript(`window.localStorage.getItem("tirrel-desktop-auth")`);
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
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
        if (process.platform !== 'darwin') {
            // Find the arg that is our custom protocol url and store it
            const deepLink = argv.find((arg) => arg.startsWith('scene://'));
            if (deepLink) {
                mainWindow.webContents.send('deepLink', deepLink);
            }
        }
    });

    app.whenReady().then(async () => {
        installExtension(REACT_DEVELOPER_TOOLS)
        setupLocalFilesNormalizerProxy();
        // check once on startup and then again every half hour
        autoUpdater.checkForUpdatesAndNotify();
        app.addEventListener('update-downloaded',
            () => ipcMain.send('update-downloaded'));
        setInterval(() => autoUpdater.checkForUpdatesAndNotify(), 1800000);
    });
    app.on('ready', async () => {
        createWindow(dl_url);
        app.on("activate", function async() {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow(dl_url);
            }
        });
        if (process.platform !== 'darwin') {
            // Find the arg that is our custom protocol url and store it
            const deepLink = argv.find((arg) => arg.startsWith('scene://'));
            if (deepLink) {
                mainWindow.webContents.send('deepLink', deepLink);
            }
        }
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

// Handle frontend app version query. No better way to do this, afaict.
ipcMain.handle('query-version', () => app.getVersion());

// See src/components/Onboarding/confirm.js.
// We respawn the app once we set the cookies so that we relaunch into the desktop.
ipcMain.on('respawn', () => {
    const options = {
        args: process.argv,
        execPath: process.execPath
    };
    if (process.env.APPIMAGE) {
        options.execPath = process.env.APPIMAGE;
        options.args.unshift('--appimage-extract-and-run');
    }
    app.relaunch(options);
    app.quit(0);
})

ipcMain.handle('get-user-data-folder', () => app.getPath('userData'));