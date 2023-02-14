import * as Vibrant from 'node-vibrant';

async function getBackgroundImage() {
  // scry against :switchboard
  const filetype = await window.scene.checkBackground();
  const folder = await window.scene.getUserFolder();
  return filetype ? `${folder}/background.${filetype}` : 'hallstatt.jpg';
}

async function setBackgroundImage(next, callback) {
  if (next === '') {
    const filetype = await window.scene.checkBackground();
    return window.scene.deleteBackground(filetype).then(() => {
      callback('hallstatt.jpg')
    });
  }
  const filetype = await window.scene.checkBackground();
  if (filetype) {
    await window.scene.deleteBackground(filetype);
  }
  const folder = await window.scene.getUserFolder();
  const res = await fetch(next);
  const contentType = res.headers.get('content-type');
  if (!contentType.startsWith('image')) {
    throw new Error('The content at the given URL is not an image.');
  }
  const buffer = await res.arrayBuffer();
  return window.scene.saveBackground(contentType.split('/')[1], Buffer.from(buffer)).then(() => {
    callback(`${folder}/background.${contentType.split('/')[1]}?${new Date().getTime()}`)
  });
}

export {
  getBackgroundImage,
  setBackgroundImage,
  getBackgroundImage as get,
  setBackgroundImage as set,
}

export function getColors(img) {
  return Vibrant.from(img).getPalette().then((pal) => Object.assign(...Object.entries(pal).map(([swatch, val]) => ({ [swatch]: val.getRgb() }))))
}