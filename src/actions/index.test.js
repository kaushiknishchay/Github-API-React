import {beginSignIn, getUserInfo, SIGN_OUT, signOut} from "./index";

jest.mock("../service/httpFetch");

describe('Actions', function () {

	let dispatch;

	beforeAll(() => {
		dispatch = jest.fn();
	});

	afterEach(() => {
		dispatch.mockClear();
	});

	it('==> Sign Out', () => {

		expect(signOut()).toEqual({
			type: SIGN_OUT
		});

	});

	it('==> Login', async () => {

		await beginSignIn("blah", "blah")(dispatch);
		expect(dispatch.mock.calls[0][0]).toEqual({
			type: 'SIGNIN_REQUEST'
		});

		expect(dispatch.mock.calls[1][0]).toEqual({
			type: 'SIGNED_IN',
			token: 'i-got-token'
		});

	});

	it('==> User Info', async () => {

		await getUserInfo()(dispatch);

		expect(dispatch.mock.calls[0][0]).toEqual({
			type: 'USER_DATA',
			user: {
				login: "iAmUser",
				avatar_url: "http://myimage.com"
			}
		});

	});
});