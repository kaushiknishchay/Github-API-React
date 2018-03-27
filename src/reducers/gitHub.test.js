import * as localStorage from "jest-localstorage-mock";

describe('authenticate reducer', () => {

	// let localStorage;

	beforeEach(() => {
		localStorage.getItem = jest.fn().mockImplementation((key) => {
			// console.log("hh");
			return key + "===";
		});
	});

	it('should return the initial state', () => {

		expect(authenticate(undefined, {}))
				.toEqual({loggedIn: false});
	});

	it('Login Request', () => {

		expect(authenticate({}, {
			type: actionConstants.LOGIN_REQUEST,
			username: "admin"
		})).toEqual({
			loggedIn: false,
			loggingIn: true,
			username: "admin"
		});
	});

	it('Login Success', () => {

		expect(authenticate({}, {
			type: actionConstants.LOGIN_SUCCESS,
			user: {
				username: "admin",
				api_key: "JAFFKVNSI==="
			}
		})).toEqual({
			loggedIn: true,
			username: "admin",
			ApiToken: "JAFFKVNSI==="
		});
	});

	it('Login Failure', () => {

		expect(authenticate({}, {
			type: actionConstants.LOGIN_FAILURE,
			error: "Login Failed"
		})).toEqual({
			loggedIn: false,
			loginError: "Login Failed",
		});
	});


	it('Logout', () => {

		expect(authenticate({}, {
			type: actionConstants.LOGOUT,
		})).toEqual({
			loggedIn: false,
			username: "",
			ApiToken: ""
		});
	});

});