const ipcRenderer = require('electron').ipcRenderer;
const fs = require('fs');
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// const { contextBridge } = require("electron");

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
// process.once("loaded", () => {
//     contextBridge.exposeInMainWorld("versions", process.versions);
// });

window.scene = {
  respawn: () => {
    ipcRenderer.send('respawn');
  },
  checkBackground: async () => {
    const path = await ipcRenderer.invoke('get-user-data-folder');
    return ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif', 'svg'].find((filetype) => {
      return fs.existsSync(`${path}/background.${filetype}`);
    })
  },
  deleteBackground: async (filetype) => {
    const userFolder = await ipcRenderer.invoke('get-user-data-folder');
    return fs.rmSync(`${userFolder}/background.${filetype}`);
  },
  getUserFolder: async () => {
    const folder = await ipcRenderer.invoke('get-user-data-folder');
    return folder;
  },
  handleUpdateDownloaded: callback => {
    ipcRenderer.on('update-downloaded', callback);
  },
  queryVersion: () => ipcRenderer.invoke('query-version'),
  saveBackground: async (filetype, data) => {
    const userFolder = await ipcRenderer.invoke('get-user-data-folder');
    return fs.writeFileSync(`${userFolder}/background.${filetype}`, data);
  },
}
