export const allyReducer = (state, action) => {
    switch (Object.keys(action)[0]) {
        case "ini":
            return action.ini;
    }
}

export default allyReducer;