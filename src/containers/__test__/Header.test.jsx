import React from 'react';
import { shallow } from 'enzyme';
import Header from '../../components/Header';
import HeaderContainer from '../Header';

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
});
