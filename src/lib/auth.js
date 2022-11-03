export const setAuth = input => {
    // { ship, code, url }
    if (!input?.ship) {
        throw new Error('cannot set auth credentials, missing ship');
    }
    if (!input?.code) {
        throw new Error('cannot set auth credentials, missing code');
    }
    if (!input?.url) {
        throw new Error('cannot set auth credentials, missing url');
    }
    let auth = {...input};
    if (input.ship.startsWith('~')) {
        auth.ship = input.ship.replace(/^~/, '');
    }
    if (!input.url.startsWith('https://')) {
        if (/^(?:.*:\/\/)/.test(input.url)) {
            // starts with some other protocol like http? replace it with https
            auth.url = input.url.replace(/^(?:.*:\/\/)/, 'https://')
        } else {
            // doesn't start with a protocol but it should
            auth.url = `https://${input.url}`
        }
    }

    window.localStorage.setItem('tirrel-desktop-auth', JSON.stringify(auth));
}

export const clearAuth = () => {
    window.localStorage.removeItem('tirrel-desktop-auth');
    window.scene.respawn();
}

export const getAuth = () => {
    const res = window.localStorage.getItem('tirrel-desktop-auth');
    if (!res) {
        return;
    }
    return JSON.parse(res);
}
