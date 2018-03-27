import {SIGN_OUT, SIGNED_IN, SIGNIN_REQUEST, USER_DATA} from "../actions";
import {fromJS} from "immutable";

const initialState = fromJS({
    loginRequest: null,
    token: localStorage.getItem("auth-token"),
    user: null
});

export function gitHub(state = initialState, action) {
    switch (action.type) {
        case SIGNIN_REQUEST:
            return state.set('loginRequest', true);
        case SIGNED_IN:
            return state.merge({
                loginRequest: false,
                token: action.token
            });
        case SIGN_OUT:
            return state.merge({
                token: null,
                user: null
            });
        case USER_DATA:
            return state.set('user', action.user);
        default:
            return state;
    }
}