import React from 'react';
import { shallow } from 'enzyme';

import { ErrorMsg, OverMsg } from '../InfoMessage';

describe('InfoMessage', () => {
  it('should render <ErrorMsg/>', () => {
    const wrapper = shallow(<ErrorMsg msg="message" errorMsg="error" />);
    expect(wrapper.find('p').at(0).text()).toEqual('message');
  });
  it('should render <OverMsg/>', () => {
    const wrapper = shallow(<OverMsg msg="message" />);
    expect(wrapper.find('p').at(0).text()).toEqual('message');
  });
});
