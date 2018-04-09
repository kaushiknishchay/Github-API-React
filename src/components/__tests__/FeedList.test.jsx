import { shallow } from 'enzyme';
import React from 'react';

import FeedList from '../FeedsList';

describe('<FeedList/>', () => {
  let feeds;

  beforeAll(() => {
    feeds = [{
      id: '7488865921',
      type: 'PushEvent',
      actor: {
        avatar_url: 'http://lorempixel.com/',
      },
      repo: {
        name: 'react',
      },
      payload: {
        commits: [{
          message: 'commit message',
        }],
      },
    },
    {
      id: '7487865933',
      type: 'PullEvent',
      created_at: 'rtdyfgu',
    }];
  });

  it('should render nothing', () => {
    const wrapper = shallow(<FeedList />);
    expect(wrapper.find('.list-group-item').length).toEqual(0);
  });

  it('should render feedList with 2 items', () => {
    const wrapper = shallow(<FeedList feeds={feeds} />);
    const listItems = wrapper.find('.list-group-item');
    expect(listItems.length).toEqual(2);

    const firstItem = listItems.first();
    // 1st list item
    expect(firstItem.find('p.mb-1').text()).toEqual('commit message');
    expect(firstItem.find('img').prop('src')).toEqual('http://lorempixel.com/');
    expect(firstItem.find('small').text()).toEqual('');


    const secondItem = listItems.at(1);
    expect(secondItem.find('p.mb-1').text()).toEqual('');
    expect(secondItem.find('small').text()).toEqual('Invalid date');
  });
});
