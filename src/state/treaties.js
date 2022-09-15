import { normalizeDocket, normalizeDockets } from "../lib/utils";

export const treatyReducer = (state, action) => {
    switch (Object.keys(action)[0]) {
        case "ini":
            const treaties = normalizeDockets(action.ini);
            return { ...state, ...treaties };
        case "add":
            const { ship, desk } = action.add;
            const treaty = normalizeDocket(action.add, desk);
            return { ...state, [`${ship}/${desk}`]: treaty }
    }
}