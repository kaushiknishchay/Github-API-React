import { shallow } from 'enzyme';
import React from 'react';

import { TabBarC } from '../Tabs/TabBar';
import TabItem from '../../components/Tabs/Item';

describe('<TabBarC />', () => {
  it('should render only 1 Tab', () => {
    const wrapper = shallow(<TabBarC user={null} />);
    expect(wrapper.find(TabItem).length).toBe(1);
  });

  it('should render 3 Tabs', () => {
    const user = {
      id: 1,
      login: 'username',
    };
    const wrapper = shallow(<TabBarC user={user} />);
    expect(wrapper.find(TabItem).length).toBe(3);
  });
});
