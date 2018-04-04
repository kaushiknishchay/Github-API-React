import axios from 'axios';
import { ROOT_URL, TOKEN_URL } from '../lib/constants';

const getDefaultConfig = () => ({
  // use a function so it doesn't cache the config info
  baseURL: ROOT_URL,
  headers: {
    Authorization: `token ${localStorage.getItem('auth-token')}`,
  },
});

export function fetchAuthToken(token) {
  return axios.get(`${TOKEN_URL}/${token}`);
}

export function fetchUserDetails() {
  return axios.get('/user', getDefaultConfig());
}


export function fetchFeeds(username) {
  return axios.get(`/users/${username}/events`, getDefaultConfig());
}

export function fetchPublicFeeds() {
  return axios.get(`${ROOT_URL}/events`);
}

export function fetchRepos(username) {
  return axios.get(`/users/${username}/repos`, getDefaultConfig());
}
