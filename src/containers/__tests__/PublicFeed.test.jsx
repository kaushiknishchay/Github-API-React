import React from 'react';
import { mount } from 'enzyme';


import { PublicFeedC } from '../PublicFeed';
import FeedList from '../../components/FeedsList';

jest.mock('../../service/httpFetch');


describe('<PublicFeedC />', () => {
  it('should render', async () => {
    jest.useFakeTimers();

    const mockGetPublicFeedfn = jest.spyOn(PublicFeedC.prototype, 'getPublicFeed');

    const wrapper = mount(<PublicFeedC />);

    expect(mockGetPublicFeedfn).toHaveBeenCalled();

    expect(wrapper.find(FeedList)).toBeTruthy();

    wrapper.instance().getPublicFeed(2);

    await setTimeout(() => {
      expect(wrapper.state().feedList.length).toEqual(2);
    }, 0);

    jest.runAllTimers();
  });
});
