import {SIGN_OUT, signOut} from "./index";

describe('Actions test', function () {

    let dispatch;

    beforeAll(() => {
        dispatch = jest.fn();
    });

    afterEach(() => {
        dispatch.mockClear();
    });

    beforeEach(() => {
    });

    it('signout action', () => {

        expect(signOut()).toEqual({
            type: SIGN_OUT
        });

    });

    it('')
});