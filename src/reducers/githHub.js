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
  userFeedsError: {
    type: '',
    msg: '',
  },
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
      });
    case USER_DATA:
      return state.set('user', action.user);
    case USER_FEEDS_ERROR:
      return state.merge({
        userFeedsError: {
          type: 'error',
          msg: action.error,
        },
        normalizedFeed: null,
      });
    case USER_FEEDS:
      return state.merge({
        userFeedsError: {
          type: '',
          msg: '',
        },
        normalizedFeed: action.normalizedFeed,
      });
    case USER_FEEDS_UPDATE:
      return state.updateIn(
        ['normalizedFeed', 'result'],
        arr => arr.concat(action.normalizedFeed.result),
      ).mergeDeepIn(['normalizedFeed', 'entities'], fromJS(action.normalizedFeed.entities))
        .merge({
          userFeedsError: {
            type: '',
            msg: '',
          },
        });
    case USER_FEEDS_UPDATE_OVER:
      return state.merge({ userFeedsError: { type: 'over', msg: action.error } });
    default:
      return state;
  }
}
