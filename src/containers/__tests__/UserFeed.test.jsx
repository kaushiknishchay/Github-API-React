import React from 'react';
import { mount } from 'enzyme';
import { fromJS } from 'immutable';


import { UserFeedC } from '../UserFeed';

describe('<UserFeed />', () => {
  it('should render', () => {
    const feedList = [{
      id: 123,
      type: 'Pull =Event',
    }];

    const user = {
      login: 'username',
    };

    const userFeedsError = fromJS({
      type: '',
      msg: '',
    });

    const mockFetchUserFeedsfn = jest.fn();

    const wrapper = mount(<UserFeedC
      getUserFeedsList={feedList}
      user={user}
      userFeedsError={userFeedsError}
      isAuthenticated
      fetchUserFeeds={mockFetchUserFeedsfn}
    />);

    const listContainer = wrapper.find('.list-group');

    expect(listContainer.find('a').length).toEqual(1);

    expect(mockFetchUserFeedsfn).toHaveBeenCalledWith('username');
  });
});
