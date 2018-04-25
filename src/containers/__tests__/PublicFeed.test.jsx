import React from 'react';
import { mount } from 'enzyme';


import { PublicFeedC } from '../PublicFeed';
import FeedList from '../../components/FeedsList';

jest.mock('../../service/httpFetch');


describe('<PublicFeedC />', () => {
  it('should render', async () => {
    jest.useFakeTimers();

    const spyGetPublicFeedfn = jest.spyOn(PublicFeedC.prototype, 'getPublicFeed');

    const wrapper = mount(<PublicFeedC />);

    // check if API triggered on component Mount
    expect(spyGetPublicFeedfn).toHaveBeenCalled();

    // check if FeedList component present
    expect(wrapper.find(FeedList)).toBeTruthy();

    // manually call API call to fetch more feeds
    wrapper.instance().getMorePublicFeeds();

    // check if getMorePublicFeeds triggered api call
    expect(spyGetPublicFeedfn).toHaveBeenCalledWith(wrapper.state().publicFeedPageNum);

    await setTimeout(() => {
      expect(wrapper.state().feedList.length).toEqual(2);
    }, 0);

    jest.runAllTimers();
  });
});
