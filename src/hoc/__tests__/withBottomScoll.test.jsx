import React from 'react';
import { shallow } from 'enzyme';


import withBottomScroll from '../withBottomScroll';
import FeedList from '../../components/FeedsList';

describe('withBottomScroll HOC', () => {
  it('should render a FeedList hoc', () => {
    const mockRefreshMethodfn = jest.fn();

    const AdvComponent = withBottomScroll(FeedList, 'feeds', mockRefreshMethodfn);

    const wrapper = shallow(<AdvComponent />);

    // check if feedList component present
    expect(wrapper.find(FeedList).length).toEqual(1);

    // manual call bottomDetect function
    wrapper.instance().bottomDetect();

    // check if refreshMethod called or not
    expect(mockRefreshMethodfn).toHaveBeenCalled();
  });
});
