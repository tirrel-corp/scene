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
