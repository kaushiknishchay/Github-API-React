import React from 'react';
import { mount } from 'enzyme';
import { fromJS } from 'immutable';


import { UserFeedC } from '../UserFeed';

describe('<UserFeed />', () => {
  let feedList;
  let user;
  let userFeedsError;

  beforeAll(() => {
    feedList = [{
      id: 123,
      type: 'Pull =Event',
    }];

    user = {
      login: 'username',
    };

    userFeedsError = fromJS({
      type: '',
      msg: '',
    });
  });

  it('should render', () => {
    const mockFetchUserFeedsfn = jest.fn();

    const wrapper = mount(<UserFeedC
      getUserFeedsList={feedList}
      user={user}
      userFeedsError={userFeedsError}
      isAuthenticated
      fetchUserFeeds={mockFetchUserFeedsfn}
    />);

    // check if defaultProps returning null as expected
    expect(UserFeedC.defaultProps.fetchUserFeeds()).toEqual(null);

    const listContainer = wrapper.find('.list-group');

    expect(listContainer.find('a').length).toEqual(1);

    expect(mockFetchUserFeedsfn).toHaveBeenCalledWith('username');

    // trigger more feeds function
    wrapper.instance().getMoreFeeds();

    expect(mockFetchUserFeedsfn).toHaveBeenCalledWith('username', 2);
  });
});
