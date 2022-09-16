import { normalizeDocket } from "../lib/utils";

export const chargeReducer = (state, action) => {
    switch (Object.keys(action)[0]) {
        case 'initial':
            return { charges: action.initial };
        case 'add-charge':
            const { desk, charge } = action['add-charge'];
            return addCharge(state, desk, charge);
        case 'del-charge':
            return delCharge(state, action?.['del-charge']);
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

export default chargeReducer;