export const normalizeDocket = (docket, desk) => {
    return { ...docket, desk, color: normalizeUrbitColor(docket.color) }
};

export const normalizeDockets = (dockets) => {
    return Object.entries(dockets).reduce((obj, [key, value]) => {
        const [, desk] = key.split('/');
        obj[key] = normalizeDocket(value, desk || key);
        return obj;
    }, {});
}

export const normalizeUrbitColor = (color) => {
    if (color.startsWith('#')) {
        return color
    }
    const colorString = color.slice(2).replace('.', '').toUpperCase();
    const lengthAdjustedColor = colorString.padEnd(6, colorString.slice(0, -1));
    return `#${lengthAdjustedColor}`
}

export const fetchAsDataURL = (url) => fetch(url)
    .then(res => res.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    }));
