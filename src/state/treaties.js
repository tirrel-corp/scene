import { normalizeDocket, normalizeDockets } from "../lib/utils";
import { api } from "./api";
import { scryAllyTreaties } from "@urbit/api";

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
export const getTreaties = async (ship) => {
    const treaties = await api.scry(scryAllyTreaties(ship));
    return treaties;
}