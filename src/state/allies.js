export const allyReducer = (state, action) => {
    console.log(state);
    console.log(action);
    switch (Object.keys(action)[0]) {
        case "ini":
            return action.ini;
        case "new":
            const { ship, alliance } = action.new;
            return { ...state, [ship]: alliance }
        case "add":
            return { ...state, [action.add]: [] }
        default:
            return state;
    }
}

export default allyReducer;