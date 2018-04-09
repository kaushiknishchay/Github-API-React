/* eslint-disable no-unused-vars,class-methods-use-this */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as Raven from 'raven-js';
import Spinner from 'react-spinkit';


import { getUserFeeds, getUserInfo } from '../actions';
import Profile from './Profile';
import RepoList from './RepoList';
import { fetchPublicFeeds, fetchRepos, fetchReposByName } from '../service/httpFetch';
import FeedList from './FeedsList';
import SearchInput from './SearchInput';
import { PUBLIC_FEEDS_ERROR, USER_REPO_ERROR } from '../lib/constants';
import getUserFeedsList from '../lib/userFeedSelector';
import ProfileDataList from './ProfileDataList';
import TabContent from './Tabs/Content';
import TabBar from '../containers/Tabs/TabBar';
import withBottomScroll from '../hoc/withBottomScroll';

// eslint-disable-next-line react/prop-types
const ErrorMsg = ({ msg, errorMsg }) => (<div className="alert alert-danger error"><h1>Please try again.</h1> <p>{`${msg}`}</p><p>{`${errorMsg}`}</p></div>);

const OverMsg = ({ msg }) => (<div className="alert alert-info"><p>{`${msg}`}</p></div>);
OverMsg.propTypes = {
  msg: PropTypes.string.isRequired,
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repoList: [],
      feedList: [],
      isError: 0,
      errorMsg: '',
      userFeedPageNum: 2,
      publicFeedPageNum: 2,
      repoSearchPageNum: 2,
    };
    this.homeRef = null;
    this.getUserRepos = this.getUserRepos.bind(this);
    this.getPublicFeed = this.getPublicFeed.bind(this);
    this.getMoreFeeds = this.getMoreFeeds.bind(this);
    this.getMoreRepos = this.getMoreRepos.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    // if user logged in, show his feed
    if (this.props.isAuthenticated && !this.props.user) {
      this.props.getInfo();
    }

    // if user not logged in, show public feed
    if (!this.props.isAuthenticated && this.props.loginRequest === false) {
      this.getPublicFeed();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    // user just signed in, and data isn't fetched so fetch data
    if (nextProps.isAuthenticated && !nextProps.user) {
      this.props.getInfo();
    }

    // user is logged in, user data is fetched, so fetch user feeds list
    if (nextProps.isAuthenticated && nextProps.user &&
      (nextProps.userFeedsError === null && nextProps.getUserFeedsList === null)) {
      // if feed list empty and if there was an error in fetching last time then dont fetch
      this.props.fetchUserFeeds(nextProps.user.login);
    }

    // user has signed out, fetched public feeds
    if (!nextProps.isAuthenticated
      && nextState.feedList !== null
      && (!nextState.feedList.length > 0 && nextState.isError !== PUBLIC_FEEDS_ERROR)) {
      // if no error came in fetching public feeds then fetch them else stop

      this.getPublicFeed();
    }
  }

  componentWillUnmount() {
    this.homeRef = null;
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

  getMoreFeeds() {
    const { isAuthenticated, user } = this.props;
    const { userFeedPageNum, isError, publicFeedPageNum } = this.state;

    if (isAuthenticated) { // if logged in fetch user feeds
      this.props.fetchUserFeeds(user.login, userFeedPageNum);
      this.setState((state, props) => ({
        userFeedPageNum: state.userFeedPageNum + 1,
      }));
    }
    if (isError !== PUBLIC_FEEDS_ERROR) {
      this.getPublicFeed(publicFeedPageNum);
      this.setState((state, props) => ({
        publicFeedPageNum: state.publicFeedPageNum + 1,
      }));
    }
  }

  getPublicFeed(pageNum) {
    if (this.homeRef) {
      fetchPublicFeeds(pageNum).then((res) => {
        if (pageNum <= 1) {
          this.setState({
            feedList: res.data,
            repoList: [],
          });
        } else {
          this.setState((state, props) => ({
            feedList: state.feedList.concat(res.data),
            repoList: [],
          }));
        }
      }).catch((err) => {
        this.setState({
          isError: PUBLIC_FEEDS_ERROR,
          errorMsg: `${err.toString().includes('403')}` ? 'API Limit Exceeded' : '',
        });
      });
    }
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
    const {
      user: data, userFeedsError, isAuthenticated,
      getUserFeedsList: userFeeds, feedExhaustError,
    } = this.props;

    const {
      repoList, isError, feedList: publicFeedList, errorMsg, searchQuery,
    } = this.state;

    const feedList = isAuthenticated ? userFeeds : publicFeedList;
    const showSpinner = isError === 0 && (feedList === null || feedList.length === 0);
    const feedError = isError === PUBLIC_FEEDS_ERROR || userFeedsError !== null;
    const repoError = isError === USER_REPO_ERROR;

    const RepoListAdv = withBottomScroll(RepoList, 'search', this.getMoreRepos);

    return (
      <div className="row" ref={(re) => { this.homeRef = re; }}>
        <div className="col-lg-12">

          <Profile data={data} />

          <TabBar />

          <div className="tab-content" id="myTabContent">

            <TabContent name="feeds" active>
              {feedError && <ErrorMsg msg="Can not fetch feeds." errorMsg={errorMsg} />}
              {showSpinner && <Spinner name="line-scale" className="loading" />}
              <FeedList feeds={feedList} getMoreFeeds={this.getMoreFeeds} />
              {feedExhaustError && <OverMsg msg={feedExhaustError} />}
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
  // token: null,
  user: null,
  userFeedsError: null,
  getInfo: () => null,
  fetchUserFeeds: () => null,
  getUserFeedsList: [],
  loginRequest: false,
  isAuthenticated: localStorage.getItem('auth-token') !== undefined,
  feedExhaustError: null,
};

Home.propTypes = {
  // token: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object,
  getUserFeedsList: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  userFeedsError: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  getInfo: PropTypes.func,
  fetchUserFeeds: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  loginRequest: PropTypes.bool,
  feedExhaustError: PropTypes.string,
};

function mapState(state) {
  return {
    user: state.getIn(['github', 'user']),
    token: state.getIn(['github', 'token']),
    userFeedsError: state.getIn(['github', 'userFeedsError']),
    feedExhaustError: state.getIn(['github', 'feedExhaustError']),
    isAuthenticated: state.getIn(['github', 'isAuthenticated']),
    loginRequest: state.getIn(['github', 'loginRequest']),
    getUserFeedsList: getUserFeedsList(state),
  };
}


function mapDispatch(dispatch) {
  return bindActionCreators({
    getInfo: getUserInfo,
    fetchUserFeeds: getUserFeeds,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(Home);
