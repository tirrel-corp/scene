export const setAuth = input => {
    // { code, url }
    if (!input?.code) {
        throw new Error('cannot set auth credentials, missing code');
    }
    if (!input?.url) {
        throw new Error('cannot set auth credentials, missing url');
    }
    let auth = { ...input };
    if (input.code.startsWith('~')) {
        auth.code = input.code.replace(/^~/, '');
    }

    window.localStorage.setItem('tirrel-desktop-auth', JSON.stringify(auth));
    window.scene.respawn();
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
