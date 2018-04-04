import * as Raven from 'raven-js';
import { normalize } from 'normalizr';

import userFeedsSchema from '../lib/schema';
import { fetchAuthToken, fetchFeeds, fetchUserDetails } from '../service/httpFetch';
import { sentryExtra } from '../lib/utils';

export const SIGNIN_REQUEST = 'SIGNIN_REQUEST';
export const SIGNED_IN = 'SIGNED_IN';
export const SIGNED_IN_FAILED = 'SIGNED_IN_FAILED';
export const SIGN_OUT = 'SIGN_OUT';
export const USER_DATA = 'USER_DATA';
export const USER_FEEDS = 'USER_FEEDS';
export const USER_FEEDS_ERROR = 'USER_FEEDS_ERROR';

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

  function error() {
    localStorage.removeItem('auth-token');

    return {
      type: SIGNED_IN_FAILED,
    };
  }

  return (dispatch) => {
    dispatch(start());

    fetchAuthToken(authCode).then((res) => {
      const authToken = res.data.token;
      if (authToken !== undefined) {
        localStorage.setItem('auth-token', authToken);
        dispatch(success(authToken));
      } else {
        dispatch(error());
      }
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
    fetchUserDetails().then((res) => {
      // console.log(res.data);
      dispatch(success(res.data));
    }).catch((err) => {
      Raven.captureException(err, sentryExtra('Error while fetching user Info'));
    });
  };
}

export function getUserFeeds(login) {
  function success(feeds, normalizedFeed) {
    return {
      type: USER_FEEDS,
      // userFeeds: feeds,
      normalizedFeed,
    };
  }

  function error(err) {
    return {
      type: USER_FEEDS_ERROR,
      error: err,
    };
  }

  return (dispatch) => {
    fetchFeeds(`${login}`).then((res) => {
      dispatch(success(res.data, normalize(res.data, userFeedsSchema)));
    }).catch((err) => {
      dispatch(error(err));
      // Raven.captureException(err, sentryExtra('Error while fetching user feeds'));
    });
  };
}

export function signOut() {
  localStorage.removeItem('auth-token');
  return {
    type: SIGN_OUT,
  };
}
