const initialState = {
    user: {}
}

export const userReducer = (state = initialState, action) => {
    // console.log(initialState);
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return {
                ...state, user: action.payload
            }
        case "LOGIN_ERROR":
            return initialState;
        case "LOGOUT":
            return initialState;
        default:
            return state;
    }
}


// User Login state reducer