import axios from 'axios';
import { ROOT_URL, TOKEN_URL } from '../lib/constants';

const getDefaultConfig = () => ({
  // use a function so it doesn't cache the config info
  baseURL: ROOT_URL,
  headers: {
    Authorization: `token ${localStorage.getItem('auth-token')}`,
  },
});

const axiosAuthedGet = url => axios.get(url, getDefaultConfig());

export function fetchAuthToken(token) {
  return axios.get(`${TOKEN_URL}/${token}`);
}

export function fetchUserDetails() {
  return axiosAuthedGet('/user'); // axios.get('/user', getDefaultConfig());
}


export function fetchFeeds(username, pageNum = 1) {
  return axiosAuthedGet(`/users/${username}/events?page=${pageNum}`);
}

export function fetchReposByName(repoName, pageNum = 1) {
  return axiosAuthedGet(`/search/repositories?q=${repoName}&page=${pageNum}`);
}

export function fetchPublicFeeds(pageNum = 1) {
  return axios.get(`${ROOT_URL}/events?page=${pageNum}`);
}

export function fetchRepos(username, pageNum = 1) {
  return axiosAuthedGet(`/users/${username}/repos?page=${pageNum}`);
}
