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
import { ErrorMsg, OverMsg } from './InfoMessage';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repoList: [],
      feedList: [],
      isError: 0,
      errorMsg: '',
      publicFeedError: {
        type: '',
        msg: '',
        code: PUBLIC_FEEDS_ERROR,
      },
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
      (nextProps.userFeedsError.get('type') === '' && nextProps.getUserFeedsList === null)) {
      // if feed list empty and if there was an error in fetching last time then dont fetch
      this.props.fetchUserFeeds(nextProps.user.login);
    }

    // user has signed out, fetched public feeds
    if (!nextProps.isAuthenticated
      && nextState.feedList !== null
      && (
        !nextState.feedList.length > 0
        && nextState.publicFeedError.code !== PUBLIC_FEEDS_ERROR
      )) {
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
      if (res.data.length > 0) {
        if (pageNum > 1) {
          this.setState((s, p) => ({
            repoList: s.repoList.concat(res.data),
            isError: 0,
            errorMsg: '',
            repoSearchPageNum: s.repoSearchPageNum + 1,
          }));
        } else {
          this.setState({
            repoList: res.data,
            isError: 0,
            errorMsg: '',
            repoSearchPageNum: 2,
          });
        }
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
    const { isAuthenticated, user, userFeedsError } = this.props;
    const { userFeedPageNum, publicFeedError, publicFeedPageNum } = this.state;

    if (isAuthenticated && user && userFeedsError.get('type') !== 'over') {
      // if logged in fetch user feeds
      this.props.fetchUserFeeds(user.login, userFeedPageNum);
      this.setState((state, props) => ({
        userFeedPageNum: state.userFeedPageNum + 1,
      }));
    } else if (!isAuthenticated && publicFeedError.type !== 'over') {
      this.getPublicFeed(publicFeedPageNum);
    }
  }

  getPublicFeed(pageNum = 1) {
    if (this.homeRef) {
      fetchPublicFeeds(pageNum).then((res) => {
        if (pageNum <= 1) {
          // if it's first page simply add data to state
          this.setState((state, props) => ({
            feedList: res.data,
            repoList: [],
            publicFeedPageNum: 2,
          }));
        } else if (pageNum > 1) {
          // if it's > 1 page, concat the data
          if (res.data.length > 0) {
            // if we have more repos to add, then concat
            this.setState((state, props) => ({
              feedList: state.feedList.concat(res.data),
              repoList: [],
              publicFeedPageNum: state.publicFeedPageNum + 1,
            }));
          } else {
            // no more repo results present, give info message that result over
            this.setState({
              publicFeedError: {
                type: 'over',
                code: PUBLIC_FEEDS_ERROR,
                msg: 'No more results to show.',
              },
            });
          }
        }
      }).catch((err) => {
        this.setState({
          publicFeedError: {
            type: 'error',
            code: PUBLIC_FEEDS_ERROR,
            msg: `${err.toString().includes('403')}` ? 'API Limit Exceeded' : '',
          },
        });
      });
    }
  }


  getMoreRepos() {
    if (this.searchType && this.searchQuery && this.searchQuery.length >= 3) {
      if (this.searchType === 'repo') {
        this.getReposByName(this.searchQuery, this.state.repoSearchPageNum);
      }
      if (this.searchType === 'user') {
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
      getUserFeedsList: userFeeds,
    } = this.props;

    const {
      repoList, isError, feedList: publicFeedList, errorMsg, searchQuery, publicFeedError,
    } = this.state;

    const feedList = isAuthenticated ? userFeeds : publicFeedList;
    const showSpinner = isError === 0 && (feedList === null || feedList.length === 0);
    const feedError = publicFeedError.type === 'error' || userFeedsError.get('type') === 'error';
    console.log(userFeedsError.toJS());
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
              {userFeedsError.get('type') === 'over' && <OverMsg msg={userFeedsError.get('msg')} />}
              {publicFeedError.type === 'over' && <OverMsg msg={publicFeedError.msg} />}
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
  userFeedsError: {
    type: '',
    msg: '',
  },
  getInfo: () => null,
  fetchUserFeeds: () => null,
  getUserFeedsList: [],
  loginRequest: false,
  isAuthenticated: localStorage.getItem('auth-token') !== undefined,
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
