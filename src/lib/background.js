const STORAGE_KEY = "tirrel-desktop-background";
const DEFAULT = "https://tirrel.sfo3.digitaloceanspaces.com/hallstatt.jpeg";

async function getBackgroundImage() {
  // scry against :switchboard
  const res = window.localStorage.getItem(STORAGE_KEY);
  return res || DEFAULT;
}

async function setBackgroundImage(next) {
  const res = await fetch(next);
  const contentType = res.headers.get('content-type');
  if (!contentType.startsWith('image')) {
    throw new Error('The content at the given URL is not an image.');
  }

  window.localStorage.setItem(STORAGE_KEY, next);
  return;
}

export {
  getBackgroundImage,
  setBackgroundImage,
  getBackgroundImage as get,
  setBackgroundImage as set,
}
