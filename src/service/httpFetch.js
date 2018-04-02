import axios from 'axios';
import { ROOT_URL, TOKEN_URL } from '../lib/constants';

const getDefaultConfig = () => ({
  // use a function so it doesn't cache the config info
  baseURL: ROOT_URL,
  headers: {
    Authorization: `token ${localStorage.getItem('auth-token')}`,
  },
});

export function getAuthToken(token) {
  return axios.get(`${TOKEN_URL}/${token}`);
}

export function getUserDetails() {
  return axios.get('/user', getDefaultConfig());
}


export function getFeeds(username) {
  return axios.get(`/users/${username}/events`, getDefaultConfig());
}

export function getPublicFeeds() {
  return axios.get(`${ROOT_URL}/events`);
}

export function getRepos(username) {
  return axios.get(`/users/${username}/repos`, getDefaultConfig());
}
