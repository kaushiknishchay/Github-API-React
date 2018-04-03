import { fromJS } from 'immutable';
import { SIGN_OUT, SIGNED_IN, SIGNED_IN_FAILED, SIGNIN_REQUEST, USER_DATA, USER_FEEDS, USER_FEEDS_ERROR } from '../actions';
import { isTokenSaved } from '../lib/utils';

const initialState = fromJS({
  loginRequest: null,
  token: localStorage.getItem('auth-token'),
  user: null,
  isAuthenticated: isTokenSaved(),
  userFeeds: null,
  userFeedsError: null,
});

export default function gitHub(state = initialState, action) {
  switch (action.type) {
    case SIGNIN_REQUEST:
      return state.set('loginRequest', true);
    case SIGNED_IN:
      return state.merge({
        loginRequest: false,
        token: action.token,
        isAuthenticated: true,
        userFeeds: null,
      });
    case SIGN_OUT:
    case SIGNED_IN_FAILED:
      return state.merge({
        loginRequest: false,
        token: null,
        user: null,
        isAuthenticated: false,
        userFeeds: null,
      });
    case USER_DATA:
      return state.set('user', action.user);
    case USER_FEEDS_ERROR:
      return state.merge({
        userFeedsError: action.error,
        userFeeds: null,
      });
    case USER_FEEDS:
      return state.merge({
        userFeeds: action.userFeeds,
        userFeedsError: null,
      });
    default:
      return state;
  }
}
