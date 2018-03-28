export const ROOT_URL = 'https://api.github.com';

const REDIRECT_URI = 'http://localhost:3000/callback';

export const CLIENT_ID = 'a578240ef8957a4021d2';

export const GO_NUTS = Math.random().toString(36).substring(7);

export const AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user%20repo&state=${GO_NUTS}&allow_signup=false&response_type=token&type=user_agent`;
export const TOKEN_URL = 'http://localhost:9999/authenticate';

export const USER_DETAIL_URL = 'https://api.github.com/user';
