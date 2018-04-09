import React from 'react';
import { shallow } from 'enzyme';

import TabContent from '../Tabs/Content';

describe('<TabContent />', () => {
  it('should Render', () => {
    const wrapper = shallow(<TabContent name="feeds" />);

    expect(wrapper.props().id).toEqual('feeds');
  });
});
