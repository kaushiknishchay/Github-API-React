/* eslint-disable prefer-promise-reject-errors,no-unused-vars */
export function fetchAuthToken(code) {
  return new Promise((resolve, reject) => {
    if (code) {
      resolve({
        data: {
          token: 'i-got-token',
        },
      });
    } else {
      reject({
        data: {
          error: 'bad_code',
        },
      });
    }
  });
}

// noinspection JSUnusedGlobalSymbols
export function fetchUserDetails() {
  return new Promise((resolve, reject) => {
    resolve({
      data: {
        login: 'iAmUser',
        avatar_url: 'http://myimage.com',
      },
    });
  });
}

export function fetchPublicFeeds() {
  return new Promise((resolve, reject) => {
    resolve({
      data: [{
        id: 1,
        type: 'PushEvent',
        created_at: '2018-03-29T11:08:09Z',
        payload: {
          commits: {

          },
        },
      }],
    });
  });
}
//
// // noinspection JSUnusedGlobalSymbols
// export function fetchRepos(searchQuery) {
//     return axios({
//         method: "GET",
//         url: ROOT_URL + "/users/" + searchQuery + "/repos",
//         headers: {
//             Authorization: "token " + localStorage.getItem('auth-token')
//         }
//     });
// }
