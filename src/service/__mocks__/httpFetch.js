export function getAuthToken(code, state) {
	return new Promise((resolve, reject) => {
		if (code && state) {
			resolve({
				data: {
					token: "i-got-token"
				}
			});
		}
		else {
			reject("Token fetch failed");
		}
	});
}

export function getUserDetails() {
	return new Promise((resolve, reject) => {
		resolve({
			data: {
				login: "iAmUser",
				avatar_url: "http://myimage.com"
			}
		});
	});
}

export function getRepos(username) {
	return axios({
		method: "GET",
		url: ROOT_URL + "/users/" + username + "/repos",
		headers: {
			Authorization: "token " + localStorage.getItem('auth-token')
		}
	});
}