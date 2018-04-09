import { fromJS } from 'immutable';
import gitHub, { initialState } from './githHub';
import {
  SIGN_OUT,
  SIGNED_IN,
  SIGNIN_REQUEST,
  USER_DATA,
  USER_FEEDS,
  USER_FEEDS_ERROR, USER_FEEDS_UPDATE,
  USER_FEEDS_UPDATE_OVER,
} from '../actions';


// use the httpFetch mock that i created
jest.mock('../service/httpFetch');

describe('github reducer', () => {
  let initialStateLocal;

  beforeEach(() => {
    initialStateLocal = fromJS(initialState);
  });

  it('==> should give Initial State', () => {
    expect(gitHub(undefined, {})).toEqual(initialState);
  });

  it('==> should set Login Request', () => {
    expect(gitHub(initialState, {
      type: SIGNIN_REQUEST,
    })).toEqual(initialStateLocal.merge({
      loginRequest: true,
    }));
  });

  it('==> should Login', () => {
    expect(gitHub(initialState, {
      type: SIGNED_IN,
      token: 'i-got-token',
    })).toEqual(initialState.merge({
      loginRequest: false,
      token: 'i-got-token',
      isAuthenticated: true,
    }));
  });

  it('==> should Logout', () => {
    expect(gitHub(initialState, {
      type: SIGN_OUT,
    })).toEqual(initialStateLocal.merge({
      loginRequest: false,
      token: null,
      user: null,
      isAuthenticated: false,
      userFeedsError: null,
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
      isAuthenticated: true,
      normalizedFeed: null,
      userFeedsError: null,
      feedExhaustError: null,
    });
  });

  it('==> should return userFeeds', () => {
    const feed = [
      {
        id: 1,
        payload: {},
      },
      {
        id: 2,
        payload: {
          commits: {
            message: 'my commit message',
          },
        },
      },
    ];

    expect(gitHub(initialState, {
      type: USER_FEEDS,
      normalizedFeed: feed,
    })).toEqual(initialState.merge({
      normalizedFeed: feed,
    }));
  });

  it('==> should return error on UserFeeds', () => {
    expect(gitHub(initialState, {
      type: USER_FEEDS_ERROR,
      error: 'unable to fetch feeds',
    })).toEqual(initialState.merge({
      normalizedFeed: null,
      userFeedsError: 'unable to fetch feeds',
    }));
  });

  it('==> should update userFeeds', () => {
    const feed1 = {
      result: [1, 2],
      entities: {
        actor: { 1: { login: 'user' } },
        repo: { 1: { name: 'repoDummy' } },
        feed: { 1: { type: 'PushEvent' }, 2: { type: 'PullEvent' } },
      },
    };

    const feed2 = {
      result: [3, 4],
      entities: {
        actor: { 2: { login: 'user2' } },
        repo: { 1: { name: 'repoDummy' } },
        feed: { 3: { type: 'CommitEvent' }, 4: { type: 'FetchEvent' } },
      },
    };

    const mergedFeeds = {
      result: [1, 2, 3, 4],
      entities: {
        actor: { 1: { login: 'user' }, 2: { login: 'user2' } },
        repo: { 1: { name: 'repoDummy' } },
        feed: {
          1: { type: 'PushEvent' }, 2: { type: 'PullEvent' }, 3: { type: 'CommitEvent' }, 4: { type: 'FetchEvent' },
        },
      },
    };

    const newState = gitHub(initialState, {
      type: USER_FEEDS,
      normalizedFeed: feed1,
    });

    expect(gitHub(newState, {
      type: USER_FEEDS_UPDATE,
      normalizedFeed: feed2,
    }).get('normalizedFeed').toJS()).toEqual(mergedFeeds);
  });

  it('==> should return error on UserFeeds Update', () => {
    expect(gitHub(initialState, {
      type: USER_FEEDS_UPDATE_OVER,
      error: 'no more feeds',
    })).toEqual(initialState.merge({
      feedExhaustError: 'no more feeds',
    }));
  });
});
