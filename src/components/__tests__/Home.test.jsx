import { shallow } from 'enzyme';
import React from 'react';
import { HomeComponent } from '../Home';
import PublicFeed from '../../containers/PublicFeed';
import UserFeed from '../../containers/UserFeed';
import Profile from '../Profile';

jest.mock('../../service/httpFetch');

describe('<Home />', () => {
  let wrapper;

  beforeEach(() => {
  });

  it('should render', () => {
    wrapper = shallow(<HomeComponent />);
    expect(wrapper).toHaveLength(1);
  });

  it('should render PublicFeed Component', () => {
    const mockGetInfofn = jest.fn();

    wrapper = shallow(<HomeComponent
      isAuthenticated={false}
      user={null}
      getInfo={mockGetInfofn}
    />);

    expect(wrapper.find(PublicFeed)).toHaveLength(1);
  });

  it('should render UserFeed Component', () => {
    const mockGetInfofn = jest.fn();

    wrapper = shallow(<HomeComponent
      isAuthenticated
      user={null}
      getInfo={mockGetInfofn}
    />);

    // check if getInfo called on mount
    expect(mockGetInfofn).toHaveBeenCalled();

    // check if Profile Component present
    expect(wrapper.find(Profile)).toHaveLength(1);

    expect(wrapper.find(UserFeed)).toHaveLength(0);

    // set the user Props
    wrapper.setProps({
      user: {
        login: 'usern',
      },
    });

    // check if User Feed Component present
    expect(wrapper.find(UserFeed)).toHaveLength(1);
  });

  it('should call getMoreFeeds function', () => {
    const spyGetReposByName = jest.spyOn(HomeComponent.prototype, 'getReposByName');

    wrapper = shallow(<HomeComponent
      isAuthenticated
    />);

    // setup Repo Search Parameters
    wrapper.instance().searchQuery = 'airbnb';
    wrapper.instance().searchType = 'repo';

    // call the getMoreRepos method of RepoListAdv
    wrapper.instance().getMoreRepos();

    // check if method to get more repos called
    expect(spyGetReposByName).toHaveBeenCalledWith('airbnb', 2);
  });
});
