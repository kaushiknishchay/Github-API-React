import React from 'react';
import { shallow } from 'enzyme';


import TabItem from '../Tabs/Item';

describe('<TabItem />', () => {
  it('should Render', () => {
    const wrapper = shallow(<TabItem name="feeds" title="Feeds" />);

    expect(wrapper.first('a').text()).toEqual('Feeds');
    expect(wrapper.find('a').hasClass('nav-link')).toBeTruthy();
  });
});
