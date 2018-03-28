import React from 'react';
import { shallow } from 'enzyme';
import RepoList from '../RepoList';

describe('RepoList Component', () => {
  const repos = [{
    id: 35507603,
    name: 'aerosolve',
  },
  {
    id: 88910481,
    name: 'airbnb-spark-thrift',
  }];

  it('should Render', () => {
    const wrapper = shallow(<RepoList data={repos} />);

    // should show 2 repo items in list
    expect(wrapper.find('.list-group-item').length).toBe(2);
  });
});
