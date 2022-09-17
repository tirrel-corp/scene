// Module to control the application lifecycle and the native browser window.
const { app, BrowserWindow, ipcMain, protocol, shell } = require("electron");
const path = require("path");
const url = require("url");
require("dotenv").config();
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
const { localStorage } = require("electron-browser-storage");

// Create the native browser window.
function createWindow(authData) {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        // Set the path of an additional "preload" script that can be used to
        // communicate between node-land and browser-land.
        webPreferences: {
            title: "Desktop",
            preload: path.join(__dirname, "preload.js"),
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false
        },
    });

    const ses = mainWindow.webContents.session;
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        return shell.openExternal(url)
    })


    if (authData?.url || process.env.REACT_APP_URL) {
        ses.webRequest.onHeadersReceived(
            { urls: [`${authData?.url || process.env.REACT_APP_URL}/*/*`] },
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

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
    const authData = await localStorage.getItem("tirrel-desktop-auth") || "{}";
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    createWindow(JSON.parse(authData || "{}"));
    setupLocalFilesNormalizerProxy();

    app.on("activate", function async() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow(JSON.parse(authData || "{}"));
        }
    });
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

ipcMain.on('respawn', () => {
    app.relaunch();
    app.quit(0);
})

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
// const allowedNavigationDestinations = "https://my-electron-app.com";
// app.on("web-contents-created", (event, contents) => {
//     contents.on("will-navigate", (event, navigationUrl) => {
//         const parsedUrl = new URL(navigationUrl);

//         if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
//             event.preventDefault();
//         }
//     });
// });