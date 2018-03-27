import {beginSignIn, SIGN_OUT, signOut} from "./index";
const httpFetch = require("../service/httpFetch");


describe('Actions test', function () {

    let dispatch;

    beforeAll(() => {
        dispatch = jest.fn();
    });

    afterEach(() => {
        dispatch.mockClear();
    });

    it('signout action', () => {

        expect(signOut()).toEqual({
            type: SIGN_OUT
        });

    });

    it('Get Repo Info', ()=>{

        httpFetch.getAuthToken = jest.fn();

        console.log(beginSignIn("blah", "blah")(dispatch));

    })
});