/* eslint-disable no-unused-vars,class-methods-use-this */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as Raven from 'raven-js';


import { getUserInfo } from '../actions';
import Profile from './Profile';
import RepoList from './RepoList';
import { fetchRepos, fetchReposByName } from '../service/httpFetch';
import SearchInput from './SearchInput';
import { USER_REPO_ERROR } from '../lib/constants';
import ProfileDataList from './ProfileDataList';
import TabContent from './Tabs/Content';
import TabBar from '../containers/Tabs/TabBar';
import withBottomScroll from '../hoc/withBottomScroll';
import { ErrorMsg, OverMsg } from './InfoMessage';
import PublicFeed from '../containers/PublicFeed';
import UserFeed from '../containers/UserFeed';

export class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repoList: [],
      repoFetchError: {
        type: '',
        msg: '',
      },
      userRepoFetchError: {
        type: '',
        msg: '',
      },
      repoSearchPageNum: 2,
    };
    this.getUserRepos = this.getUserRepos.bind(this);
    this.getMoreRepos = this.getMoreRepos.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    // if user logged in, show his feed
    if (this.props.isAuthenticated && !this.props.user) {
      this.props.getInfo();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    // user just signed in, and data isn't fetched so fetch data
    if (nextProps.isAuthenticated && !nextProps.user) {
      this.props.getInfo();
    }
  }

  onSearchSubmit(t, q) {
    if (t === 'repo') {
      this.setState({
        repoList: [],
        repoSearchPageNum: 2,
      });
      this.getReposByName(q);
    } else if (t === 'user') {
      this.setState({
        repoSearchPageNum: 2,
        repoList: [],
      });
      this.getUserRepos(q);
    }
  }

  getReposByName(searchQuery, pageNum = 1) {
    fetchReposByName(searchQuery, pageNum).then((res) => {
      if (pageNum > 1) {
        if (res.data.items.length > 0) {
          this.setState((state, props) => ({
            repoList: state.repoList.concat(res.data.items),
            repoFetchError: {
              type: '',
              msg: '',
            },
            repoSearchPageNum: state.repoSearchPageNum + 1,
          }));
        } else {
          this.setState({
            repoFetchError: {
              type: 'over',
              msg: 'No more repos to show.',
            },
          });
        }
      } else if (res.data.items.length === 0) {
        this.setState({
          repoFetchError: {
            type: 'no-result',
            msg: 'No repos found by that name.',
          },
        });
      } else {
        this.setState({
          repoList: res.data.items,
          repoFetchError: {
            type: '',
            msg: '',
          },
          repoSearchPageNum: 2,
        });
      }
    }).catch((e) => {
      this.setState({
        repoList: [],
        repoSearchPageNum: 2,
        repoFetchError: {
          type: 'error',
          msg: `Error: ${e}`,
        },
      });
    });
  }

  getUserRepos(searchQuery, pageNum = 1) {
    fetchRepos(searchQuery, pageNum).then((res) => {
      if (pageNum > 1) {
        if (res.data.length > 0) {
          this.setState((s, p) => ({
            repoList: s.repoList.concat(res.data),
            userRepoFetchError: {
              type: '',
              msg: '',
            },
            repoSearchPageNum: s.repoSearchPageNum + 1,
          }));
        } else {
          this.setState({
            userRepoFetchError: {
              type: 'over',
              msg: 'No more repos to show.',
            },
          });
        }
      } else if (res.data.length > 0) {
        this.setState({
          repoList: res.data,
          userRepoFetchError: {
            type: '',
            msg: '',
          },
          repoSearchPageNum: 2,
        });
      } else {
        this.setState({
          repoList: [],
          userRepoFetchError: {
            type: 'no-result',
            msg: `No Repos found for user "${searchQuery}"`,
          },
        });
      }
    }).catch((err) => {
      // Raven.captureException(err, sentryExtra('Error during fetching user repos'));
      this.setState({
        userRepoFetchError: {
          type: 'error',
          msg: `${err.toString().includes('404')}` ? 'Invalid username.' : err,
        },
        repoSearchPageNum: 2,
        repoList: [],
      });
    });
  }

  getMoreRepos() {
    const { repoFetchError, repoSearchPageNum, userRepoFetchError } = this.state;

    if (this.props.isAuthenticated &&
      this.searchType && this.searchQuery && this.searchQuery.length >= 3) {
      if (this.searchType === 'repo' && (repoFetchError.type === '')) {
        this.getReposByName(this.searchQuery, repoSearchPageNum);
      }
      if (this.searchType === 'user' && userRepoFetchError.type === '') {
        this.getUserRepos(this.searchQuery, repoSearchPageNum);
      }
    }
  }

  handleSearchChange(e) {
    if (e.target) {
      if (e.target.name === 'type') {
        this.searchType = e.target.value;
      } else if (e.target.name === 'query') {
        this.searchQuery = e.target.value;
      }
    }
  }

  searchQuery = '';
  searchType= '';


  // eslint-disable-next-line class-methods-use-this
  componentDidCatch(error, errorInfo) {
    if (this.props.isAuthenticated) {
      Raven.setUserContext({
        email: this.props.user.login,
      });
    }
    Raven.captureException(error, { extra: errorInfo });
  }


  render() {
    // USER not SIGNED IN
    if (!this.props.isAuthenticated && this.props.loginRequest === false) {
      return (
        <div className="row">
          <div className="col-lg-12">
            <br />
            <PublicFeed />
            <br />
          </div>
        </div>);
    }

    const {
      user: data,
    } = this.props;

    const {
      repoList, searchQuery, repoFetchError, userRepoFetchError,
    } = this.state;

    const repoError = userRepoFetchError.type === 'error' || userRepoFetchError.type === 'no-result';
    const errorMsg = userRepoFetchError.msg;
    const isFeedsOver = userRepoFetchError.type === 'over' || repoFetchError.type === 'over';
    const isFeedsOverMsg = userRepoFetchError.msg || repoFetchError.msg;

    const RepoListAdv = withBottomScroll(RepoList, 'search', this.getMoreRepos);

    return (
      <div className="row">
        <div className="col-lg-12">

          <Profile data={data} />

          <TabBar />

          <div className="tab-content" id="myTabContent">

            <TabContent name="feeds" active>
              {data && <UserFeed />}
            </TabContent>

            <TabContent name="search">
              {
                 data &&
                 <SearchInput
                   onChange={this.handleSearchChange}
                   onClick={this.onSearchSubmit}
                   username={searchQuery}
                 />
              }
              {repoError && <ErrorMsg msg={errorMsg} errorMsg="" />}
              {
                (repoFetchError.type === 'error' || repoFetchError.type === 'no-result')
                && <ErrorMsg msg={repoFetchError.msg} errorMsg="" />
              }
              <RepoListAdv data={repoList} />
              {isFeedsOver && <OverMsg msg={isFeedsOverMsg} />}

            </TabContent>

            <TabContent name="profile">
              <ProfileDataList data={data} />
            </TabContent>

          </div>
        </div>
      </div>
    );
  }
}

HomeComponent.defaultProps = {
  user: null,
  getInfo: () => null,
  loginRequest: false,
  isAuthenticated: localStorage.getItem('auth-token') !== undefined,
};

HomeComponent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object,
  getInfo: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  loginRequest: PropTypes.bool,
};

function mapState(state) {
  return {
    user: state.getIn(['github', 'user']),
    token: state.getIn(['github', 'token']),
    isAuthenticated: state.getIn(['github', 'isAuthenticated']),
    loginRequest: state.getIn(['github', 'loginRequest']),
  };
}


function mapDispatch(dispatch) {
  return bindActionCreators({
    getInfo: getUserInfo,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(HomeComponent);
