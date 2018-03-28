import { fromJS } from 'immutable';
import { gitHub } from './githHub';
import { SIGN_OUT, SIGNED_IN, SIGNIN_REQUEST, USER_DATA } from '../actions';


// use the httpFetch mock that i created
jest.mock('../service/httpFetch');

describe('github reducer', () => {
  let initialState;

  beforeEach(() => {
    initialState = fromJS({
      loginRequest: null,
      token: null,
      user: null,
    });
  });

  it('==> should give Initial State', () => {
    expect(gitHub(undefined, {})).toEqual(initialState);
  });

  it('==> should set Login Request', () => {
    expect(gitHub(initialState, {
      type: SIGNIN_REQUEST,
    })).toEqual(fromJS({
      loginRequest: true,
      token: null,
      user: null,
    }));
  });

  it('==> should Login', () => {
    expect(gitHub(initialState, {
      type: SIGNED_IN,
      token: '',
    })).toEqual(fromJS({
      loginRequest: false,
      token: '',
      user: null,
    }));
  });

  it('==> should Logout', () => {
    expect(gitHub(initialState, {
      type: SIGN_OUT,
    })).toEqual(fromJS({
      loginRequest: false,
      token: null,
      user: null,
    }));
  });

  it('==> should Update User Profile Data', () => {
    // send a log in action first
    const loggedIn = gitHub(initialState, {
      type: SIGNED_IN,
      token: 'i-got-token',
    });

    // check if user data is set
    // and is token from login present

    expect(gitHub(loggedIn, {
      type: USER_DATA,
      user: {
        login: 'username',
        bio: 'this is my bio',
      },
    }).toJS()).toEqual({ // convert the state to JS for comparison
      loginRequest: false,
      token: 'i-got-token',
      user: {
        login: 'username',
        bio: 'this is my bio',
      },
    });
  });
});
