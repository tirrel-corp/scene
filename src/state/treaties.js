export const treatyReducer = (state, action) => {
    switch (Object.keys(action)[0]) {
        case "ini":
            return { ...state, ...action.ini };
    }
}