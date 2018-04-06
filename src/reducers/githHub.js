import { fromJS } from 'immutable';
import {
  SIGN_OUT,
  SIGNED_IN,
  SIGNED_IN_FAILED,
  SIGNIN_REQUEST,
  USER_DATA,
  USER_FEEDS,
  USER_FEEDS_ERROR,
  USER_FEEDS_UPDATE, USER_FEEDS_UPDATE_OVER,
} from '../actions';
import { isTokenSaved } from '../lib/utils';

export const initialState = fromJS({
  loginRequest: false,
  token: localStorage.getItem('auth-token'),
  user: null,
  isAuthenticated: isTokenSaved(),
  userFeedsError: null,
  feedExhaustError: null,
  normalizedFeed: null,
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
        normalizedFeed: null,
      });
    case SIGN_OUT:
    case SIGNED_IN_FAILED:
      return state.merge({
        loginRequest: false,
        token: null,
        user: null,
        isAuthenticated: false,
        normalizedFeed: null,
        feedExhaustError: null,
      });
    case USER_DATA:
      return state.set('user', action.user);
    case USER_FEEDS_ERROR:
      return state.merge({
        userFeedsError: action.error,
        normalizedFeed: null,
        feedExhaustError: null,
      });
    case USER_FEEDS:
      return state.merge({
        userFeedsError: null,
        normalizedFeed: action.normalizedFeed,
        feedExhaustError: null,
      });
    case USER_FEEDS_UPDATE:
      return state.updateIn(
        ['normalizedFeed', 'result'],
        arr => arr.concat(action.normalizedFeed.result),
      ).mergeDeepIn(['normalizedFeed', 'entities'], fromJS(action.normalizedFeed.entities)).set('feedExhaustError', null);
    case USER_FEEDS_UPDATE_OVER:
      return state.set('feedExhaustError', action.error);
    default:
      return state;
  }
}
