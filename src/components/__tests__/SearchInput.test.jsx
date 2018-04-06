import React from 'react';
import { shallow } from 'enzyme';

import SearchInput from '../SearchInput';

describe('<SearchInput/>', () => {
  it('should render', () => {
    const onClick = jest.fn();

    const wrapper = shallow(<SearchInput onClick={onClick} />);

    const eQuery = wrapper.find('[name="query"]');

    expect(eQuery.length).toEqual(1);
  });

  it('should detect Input Changes', async () => {
    const onClick = jest.fn();
    const spyOnChangefn = jest.spyOn(SearchInput.prototype, 'onChange');
    const spyhandleSubmitfn = jest.spyOn(SearchInput.prototype, 'handleSubmit');

    const wrapper = shallow(<SearchInput onClick={onClick} />);

    const eQuery = wrapper.find('[name="query"]');
    const eSubmitButton = wrapper.find('button');

    expect(eQuery.length).toEqual(1);
    expect(eSubmitButton.length).toEqual(1);

    const event = {
      target: {
        name: 'query',
        value: 'airbnb',
      },
    };

    eQuery.simulate('change', event);
    expect(spyOnChangefn).toHaveBeenCalled();

    eSubmitButton.simulate('click', {
      preventDefault: jest.fn(),
    });

    expect(spyhandleSubmitfn).toHaveBeenCalled();

    expect(onClick).toHaveBeenCalledWith('repo', 'airbnb');
  });
});
