import React from 'react';
import { shallow } from 'enzyme';

import SearchInput from '../SearchInput';

describe('<SearchInput/>', () => {
  it('should render', () => {
    const onClick = jest.fn();
    const onChange = jest.fn();

    const wrapper = shallow(<SearchInput onClick={onClick} onChange={onChange} />);

    const eQuery = wrapper.find('[name="query"]');

    expect(eQuery.length).toEqual(1);
  });

  it('should detect Input Changes', async () => {
    const mockOnClickfn = jest.fn();
    const mockOnChangefn = jest.fn();

    const spyOnChangefn = jest.spyOn(SearchInput.prototype, 'onChange');
    const spyhandleSubmitfn = jest.spyOn(SearchInput.prototype, 'handleSubmit');

    const wrapper = shallow(<SearchInput onClick={mockOnClickfn} onChange={mockOnChangefn} />);

    const eQuery = wrapper.find('[name="query"]');
    const eSelect = wrapper.find('[name="type"]');
    const eSubmitButton = wrapper.find('button');

    expect(eQuery.length).toEqual(1);
    expect(eSubmitButton.length).toEqual(1);

    const event = {
      target: {
        name: 'query',
        value: 'airbnb',
      },
    };

    const event2 = {
      target: {
        name: 'type',
        value: 'repo',
      },
    };

    eQuery.simulate('change', event);

    eSelect.simulate('change', event2);

    expect(spyOnChangefn).toHaveBeenCalled();

    eSubmitButton.simulate('click', {
      preventDefault: jest.fn(),
    });

    expect(spyhandleSubmitfn).toHaveBeenCalled();
    expect(mockOnChangefn).toHaveBeenCalledWith(event);
    expect(mockOnChangefn).toHaveBeenCalledWith(event2);
  });
});
