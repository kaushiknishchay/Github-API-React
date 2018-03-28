import axios from "axios";
import {ROOT_URL, TOKEN_URL, USER_DETAIL_URL} from "../lib/constants";

export function getAuthToken(token, state) {
    let code = token;

    return axios({
        method: 'GET',
        url: TOKEN_URL + "/" + code,
    });
}

export function getUserDetails() {
    return axios({
        method: "GET",
        params: {},
        url: USER_DETAIL_URL,
        headers: {
            Authorization: "token " + localStorage.getItem('auth-token')
        }
    });
}

export function getRepos(username) {
    return axios({
        method: "GET",
        url: ROOT_URL+"/users/"+username+"/repos",
        headers: {
            Authorization: "token " + localStorage.getItem('auth-token')
        }
    });
}