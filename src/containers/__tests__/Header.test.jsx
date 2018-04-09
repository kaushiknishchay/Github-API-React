import React from 'react';
import { shallow } from 'enzyme';
import Header from '../../components/Header';
import { HeaderContainer } from '../Header';

describe('Header Container Component', () => {
  it('should render', () => {
    const wrapper = shallow(<HeaderContainer />);
    expect(wrapper.length).toBe(1);
  });

  it('should show Sign In Button', () => {
    const onClick = jest.fn();

    const wrapper = shallow(<Header isSignIn={false} onClick={onClick} />);

    const btn = wrapper.find('button');

    expect(btn.text()).toBe('Sign In');

    btn.simulate('click', 'text');

    expect(onClick.mock.calls[0][0]).toBe('text');

    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it('should show Sign Out Button', () => {
    const onClick = jest.fn();

    const wrapper = shallow(<Header isSignIn onClick={onClick} />);

    const btn = wrapper.find('button');

    expect(btn.text()).toBe('Sign Out');

    btn.simulate('click', 'text');

    expect(onClick.mock.calls[0][0]).toBe('text');
  });

  it('should call props.signOut and goToAuthUrl method', () => {
    // setup spy and mocks
    const signOut = jest.fn();
    const goToAuthURL = jest.spyOn(HeaderContainer.prototype, 'goToAuthURL');

    // render component
    const wrapper = shallow(<HeaderContainer signOut={signOut} isSignIn />);

    // manually click the button
    wrapper.instance().onClick();

    // method called as user not signed in
    expect(goToAuthURL).toHaveBeenCalled();

    // set the token value
    localStorage.setItem('auth-token', 'i got token');

    // simulate click
    wrapper.instance().onClick();

    // method called
    expect(signOut).toHaveBeenCalled();
  });
});
