import React from 'react';
import { shallow } from 'enzyme';

import SearchInput from '../SearchInput';

describe('<SearchInput/>', () => {
  let event;
  let event2;
  let clickEvent;

  beforeAll(() => {
    event = {
      target: {
        name: 'query',
        value: 'airbnb',
      },
    };

    event2 = {
      target: {
        name: 'type',
        value: 'repo',
      },
    };

    clickEvent = {
      preventDefault: jest.fn(),
    };
  });

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

    // simulate query text enter
    eQuery.simulate('change', event);

    // simulate query type selection
    eSelect.simulate('change', event2);

    // check if onChange method triggered
    expect(spyOnChangefn).toHaveBeenCalled();

    // simulate button click
    eSubmitButton.simulate('click', clickEvent);

    // check if preventDefault called
    expect(clickEvent.preventDefault).toHaveBeenCalled();

    expect(spyhandleSubmitfn).toHaveBeenCalled();

    expect(mockOnChangefn).toHaveBeenCalledWith(event);

    expect(mockOnChangefn).toHaveBeenCalledWith(event2);
  });
});
