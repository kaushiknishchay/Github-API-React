import { getAuthToken, getUserDetails } from '../service/httpFetch';

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
      // console.log(res.data);
      const authToken = res.data.token;
      localStorage.setItem('auth-token', authToken);
      dispatch(success(authToken));
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
    }, (err) => {
      console.error(err);
    }).catch((err) => {
      console.error(err);
    });
  };
}

export function signOut() {
  return {
    type: SIGN_OUT,
  };
}
