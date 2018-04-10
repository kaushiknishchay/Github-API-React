import React from 'react';
import { shallow } from 'enzyme';
import { Redirect } from 'react-router-dom';


import { CallbackC } from '../Callback';

describe('<Callback />', () => {
  let locationProps;

  beforeAll(() => {
    locationProps = {
      search: '/?code=xxx',
    };
  });

  it('should redirect to /?login_failed, not authenticated', () => {
    const wrapper = shallow(<CallbackC />);

    expect(wrapper.find(Redirect).length).toEqual(1);

    expect(wrapper.find(Redirect).props().to).toEqual('/?login_failed');
  });

  it('should redirect with authentication', () => {
    const mockSignInfn = jest.fn();

    const wrapper = shallow(<CallbackC
      isAuthenticated={false}
      isLoggedIn
      token={null}
      signIn={mockSignInfn}
      location={locationProps}
    />);

    // check default Props SignIn function
    expect(CallbackC.defaultProps.signIn('12345')).toEqual('12345');

    // check if Redirect component present
    expect(wrapper.find(Redirect).length).toEqual(1);

    // check if redirect path is '/'
    expect(wrapper.find(Redirect).props().to).toEqual('/');

    // check is signIn method called with code
    expect(mockSignInfn).toHaveBeenCalledWith('xxx');
  });
});
