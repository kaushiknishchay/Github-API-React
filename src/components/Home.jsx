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
import { ErrorMsg } from './InfoMessage';
import PublicFeed from '../containers/PublicFeed';
import UserFeed from '../containers/UserFeed';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repoList: [],
      isError: 0,
      errorMsg: '',
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
        this.setState((state, props) => ({
          repoList: state.repoList.concat(res.data.items),
          isError: 0,
          errorMsg: '',
          repoSearchPageNum: state.repoSearchPageNum + 1,
        }));
      } else {
        this.setState({
          repoList: res.data.items,
          isError: 0,
          errorMsg: '',
        });
      }
    }).catch((e) => {
      this.setState({
        repoList: [],
        isError: USER_REPO_ERROR,
        repoSearchPageNum: 2,
        errorMsg: 'Cant fetch repo list.',
      });
    });
  }

  getUserRepos(searchQuery, pageNum = 1) {
    fetchRepos(searchQuery, pageNum).then((res) => {
      if (pageNum > 1) {
        this.setState((s, p) => ({
          repoList: s.repoList.concat(res.data),
          isError: 0,
          errorMsg: '',
          repoSearchPageNum: s.repoSearchPageNum + 1,
        }));
      } else if (res.data.length > 0) {
        this.setState({
          repoList: res.data,
          isError: 0,
          errorMsg: '',
          repoSearchPageNum: 2,
        });
      } else {
        this.setState({
          repoList: [],
          isError: USER_REPO_ERROR,
          errorMsg: `No Repos found for "${searchQuery}"`,
        });
      }
    }).catch((err) => {
      // Raven.captureException(err, sentryExtra('Error during fetching user repos'));
      this.setState({
        isError: USER_REPO_ERROR,
        errorMsg: err,
        repoSearchPageNum: 2,
        repoList: null,
      });
    });
  }

  getMoreRepos() {
    if (this.searchType && this.searchQuery && this.searchQuery.length >= 3) {
      if (this.searchType === 'repo' && this.state.isError !== USER_REPO_ERROR) {
        this.getReposByName(this.searchQuery, this.state.repoSearchPageNum);
      }
      if (this.searchType === 'user' && this.state.isError !== USER_REPO_ERROR) {
        this.getUserRepos(this.searchQuery, this.state.repoSearchPageNum);
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
      repoList, isError, errorMsg, searchQuery,
    } = this.state;

    const repoError = isError === USER_REPO_ERROR;

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
              {repoError && <ErrorMsg msg="Cant fetch repository list." errorMsg={errorMsg} />}
              <RepoListAdv data={repoList} />
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

Home.defaultProps = {
  user: null,
  getInfo: () => null,
  loginRequest: false,
  isAuthenticated: localStorage.getItem('auth-token') !== undefined,
};

Home.propTypes = {
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

export default connect(mapState, mapDispatch)(Home);
