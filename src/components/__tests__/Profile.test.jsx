import React from 'react';
import { shallow } from 'enzyme';
import Profile from '../Profile';

describe('Profile Component', () => {
  const profileData = {
    login: 'username',
    bio: 'this is my bio',
    avatar_url: 'https://avatars1.githubusercontent.com/u/15786884?v=4',
  };
  it('should Render Profile Info', () => {
    const wrapper = shallow(<Profile data={profileData} />);
    expect(wrapper.find('.mt-0').contains(profileData.login)).toBe(true);
  });

  it('should Render nothing', () => {
    const wrapper = shallow(<Profile />);
    expect(wrapper.text()).toBe('');
  });
});
