import axios from "axios";
export const ROOT_URL = "https://api.github.com";

export const defaultHeaders = {
	Accept: "application/vnd.github.v3+json"
};

axios.defaults.baseURL = ROOT_URL;
axios.defaults.headers.common['Accept'] = "application/vnd.github.v3+json";

export function getRepos(username) {
	return axios.get(`/users/${username}/repos`)
			.then(res=>{
		console.log(res)
	}, error=>{
		console.error(error);
	});
}