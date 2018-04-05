/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as Raven from 'raven-js';
import Spinner from 'react-spinkit';


import { getUserFeeds, getUserInfo } from '../actions';
import Profile from './Profile';
import RepoList from './RepoList';
import { fetchPublicFeeds, fetchRepos } from '../service/httpFetch';
import FeedList from './FeedsList';
import SearchInput from './SearchInput';
import { PUBLIC_FEEDS_ERROR, USER_REPO_ERROR } from '../lib/constants';
import getUserFeedsList from '../lib/userFeedSelector';
import ProfileDataList from './ProfileDataList';
import TabContent from './Tabs/Content';
import TabBar from '../containers/Tabs/TabBar';

// eslint-disable-next-line react/prop-types
const ErrorMsg = ({ msg, errorMsg }) => (<div className="alert alert-danger error"><h1>Please try again.</h1> <p>{`${msg}`}</p><p>{`${errorMsg}`}</p></div>);


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchRepoUsername: '',
      repoList: [],
      feedList: [],
      isError: 0,
      errorMsg: '',
    };
    this.homeRef = null;
    this.getUserRepos = this.getUserRepos.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getPublicFeed = this.getPublicFeed.bind(this);
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

  getUserRepos(e) {
    e.preventDefault();
    fetchRepos(this.state.searchRepoUsername).then((res) => {
      console.log(res.data);
      if (res.data.length > 0) {
        this.setState({
          repoList: res.data,
          isError: 0,
          errorMsg: '',
        });
      } else {
        this.setState({
          repoList: [],
          isError: USER_REPO_ERROR,
          errorMsg: `No Repos found for "${this.state.searchRepoUsername}"`,
        });
      }
    }).catch((err) => {
      // Raven.captureException(err, sentryExtra('Error during fetching user repos'));
      this.setState({
        isError: USER_REPO_ERROR,
        errorMsg: err,
        repoList: null,
      });
    });
  }


  getPublicFeed() {
    if (this.homeRef) {
      fetchPublicFeeds().then((res) => {
        this.setState({
          feedList: res.data,
        });
      }).catch((err) => {
        this.setState({
          isError: PUBLIC_FEEDS_ERROR,
          errorMsg: err,
        });
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  componentDidCatch(error, errorInfo) {
    if (this.props.isAuthenticated) {
      Raven.setUserContext({
        email: this.props.user.login,
      });
    }
    Raven.captureException(error, { extra: errorInfo });
  }

  handleChange = e => this.setState({
    searchRepoUsername: e.target.value,
  });

  render() {
    const {
      user: data, userFeedsError, isAuthenticated,
      getUserFeedsList: userFeeds,
    } = this.props;

    const {
      repoList, isError, feedList: publicFeedList, errorMsg, searchRepoUsername,
    } = this.state;

    const feedList = isAuthenticated ? userFeeds : publicFeedList;
    const showSpinner = isError === 0 && (feedList === null || feedList.length === 0);
    const feedError = isError === PUBLIC_FEEDS_ERROR || userFeedsError !== null;
    const repoError = isError === USER_REPO_ERROR;

    return (
      <div className="row" ref={(re) => { this.homeRef = re; }}>
        <div className="col-lg-12">

          <Profile data={data} />

          <TabBar />

          <div className="tab-content" id="myTabContent">

            <TabContent name="feeds" active>
              {feedError && <ErrorMsg msg="Can not fetch feeds." errorMsg={errorMsg} />}
              {showSpinner && <Spinner name="line-scale" className="loading" />}
              <FeedList feeds={feedList} />
            </TabContent>

            <TabContent name="search">
              {
                 data &&
                 <SearchInput
                   onClick={this.getUserRepos}
                   username={searchRepoUsername}
                   onChange={this.handleChange}
                 />
              }
              {repoError && <ErrorMsg msg="Cant fetch repository list." errorMsg={errorMsg} />}
              <RepoList data={repoList} />
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
};

Home.propTypes = {
  // token: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object,
  getUserFeedsList: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  userFeedsError: PropTypes.string,
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
