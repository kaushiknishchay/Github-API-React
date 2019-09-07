import React from 'react';
import { shallow } from 'enzyme';
import ProfileDataList from '../ProfileDataList';

describe('<ProfileDataList/>', () => {
  it('should Render nothing', () => {
    const wrapper = shallow(<ProfileDataList data={null} />);

    expect(wrapper.text()).toEqual('');
  });

  it('should render Profile Data List', () => {
    const profileData = {
      name: 'John Doe',
      followers: 10,
      following: 20,
      public_repos: 30,
      public_gists: 12,
      blog: 'http://john.doe/',
      location: 'New York',
    };
    const wrapper = shallow(<ProfileDataList data={profileData} />);
    const list = wrapper.find('.list-group-item');

    expect(list.length).toEqual(7);

    expect(list.at(0).text()).toEqual('John Doe');
    expect(list.at(1).text()).toEqual('Followers: 10');
    expect(list.at(2).text()).toEqual('Following: 20');
    expect(list.at(3).text()).toEqual('Public repos: 30');
    expect(list.at(4).text()).toEqual('Public Gists: 12');
    expect(list.at(5).text()).toEqual('Blog:http://john.doe/');
    expect(list.at(6).text()).toEqual('Location: New York');
  });
});
