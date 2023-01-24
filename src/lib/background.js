async function getBackgroundImage() {
  // scry against :switchboard
  const filetype = await window.scene.checkBackground();
  const folder = await window.scene.getUserFolder();
  return filetype ? `${folder}/background.${filetype}` : undefined;
}

async function setBackgroundImage(next) {
  if (next === '') {
    const filetype = await window.scene.checkBackground();
    return window.scene.deleteBackground(filetype);
  }
  const res = await fetch(next);
  const contentType = res.headers.get('content-type');
  if (!contentType.startsWith('image')) {
    throw new Error('The content at the given URL is not an image.');
  }
  const buffer = await res.arrayBuffer();
  return window.scene.saveBackground(contentType.split('/')[1], Buffer.from(buffer));
}

export {
  getBackgroundImage,
  setBackgroundImage,
  getBackgroundImage as get,
  setBackgroundImage as set,
}
