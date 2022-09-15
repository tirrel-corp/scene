export const normalizeDocket = (docket, desk) => {
    return { ...docket, desk, color: normalizeUrbitColor(docket.color) }
};

export const normalizeUrbitColor = (color) => {
    if (color.startsWith('#')) {
        return color
    }
    const colorString = color.slice(2).replace('.', '').toUpperCase();
    const lengthAdjustedColor = colorString.padEnd(6, colorString.slice(0, -1));
    return `#${lengthAdjustedColor}`
}