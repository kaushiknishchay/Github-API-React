import * as Raven from 'raven-js';

import { getAuthToken, getUserDetails } from '../service/httpFetch';
import { sentryExtra } from '../lib/utils';

export const SIGNIN_REQUEST = 'SIGNIN_REQUEST';
export const SIGNED_IN = 'SIGNED_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const USER_DATA = 'USER_DATA';

export function beginSignIn(authCode) {
  function start() {
    return {
      type: SIGNIN_REQUEST,
    };
  }

  function success(token) {
    return {
      type: SIGNED_IN,
      token,
    };
  }

  return (dispatch) => {
    dispatch(start());

    getAuthToken(authCode).then((res) => {
      const authToken = res.data.token;
      localStorage.setItem('auth-token', authToken);
      dispatch(success(authToken));
    }).catch((err) => {
      Raven.captureException(err, sentryExtra('Error while fetching auth token'));
    });
  };
}

export function getUserInfo() {
  function success(user) {
    return {
      type: USER_DATA,
      user,
    };
  }

  return (dispatch) => {
    getUserDetails().then((res) => {
      // console.log(res.data);
      dispatch(success(res.data));
    }).catch((err) => {
      Raven.captureMessage('Error while fetching user Info', {
        level: 'error',
      }).captureException(err);
    });
  };
}

export function signOut() {
  return {
    type: SIGN_OUT,
  };
}
