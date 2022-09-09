export const chargeReducer = (state, action) => {
    switch (Object.keys(action)[0]) {
        case 'initial':
            return { charges: action.initial };
        case 'add-charge':
            const { desk, charge } = action['add-charge'];
            return addCharge(state, desk, charge);
        case 'del-charge':
            return delCharge(state, desk);
        default:
            return state;
    }
}

const addCharge = (state, desk, charge) => {
    return { charges: { ...state.charges, [desk]: normalizeDocket(charge, desk) } }
};

const omit = (originalObj = {}, keysToOmit) =>
    Object.fromEntries(
        Object.entries(originalObj)
            .filter(([key]) => !keysToOmit.includes(key))
    )

const delCharge = (state, desk) => {
    return { charges: omit(state.charges, desk) }
}

const normalizeDocket = (docket, desk) => {
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

export default chargeReducer;