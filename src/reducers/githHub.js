import { fromJS } from 'immutable';
import { SIGN_OUT, SIGNED_IN, SIGNIN_REQUEST, USER_DATA } from '../actions';

const initialState = fromJS({
  loginRequest: null,
  token: localStorage.getItem('auth-token') || null,
  user: null,
});

export default function gitHub(state = initialState, action) {
  switch (action.type) {
    case SIGNIN_REQUEST:
      return state.set('loginRequest', true);
    case SIGNED_IN:
      return state.merge({
        loginRequest: false,
        token: action.token,
      });
    case SIGN_OUT:
      return state.merge({
        loginRequest: false,
        token: null,
        user: null,
      });
    case USER_DATA:
      return state.set('user', action.user);
    default:
      return state;
  }
}
