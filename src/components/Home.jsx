/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as Raven from 'raven-js';


import { getUserFeeds, getUserInfo } from '../actions';
import Profile from './Profile';
import RepoList from './RepoList';
import { getPublicFeeds, getRepos } from '../service/httpFetch';
import FeedList from './FeedsList';
import { PUBLIC_FEEDS_ERROR, USER_REPO_ERROR } from '../lib/constants';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchRepoUsername: '',
      repoList: [],
      feedList: [],
      isError: 0,
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
    if (!this.props.isAuthenticated) {
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
      (nextProps.userFeedsError === null && !nextProps.userFeeds.length > 0)) {
      // if feed list empty and if there was an error in fetching last time then dont fetch
      this.props.getUserFeeds(nextProps.user.login);
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

  getUserRepos() {
    getRepos(this.state.searchRepoUsername).then((res) => {
      this.setState({
        repoList: res.data,
      });
    }).catch((err) => {
      // Raven.captureException(err, sentryExtra('Error during fetching user repos'));
      this.setState({
        isError: USER_REPO_ERROR,
      });
    });
  }


  getPublicFeed() {
    if (this.homeRef) {
      getPublicFeeds().then((res) => {
        this.setState({
          feedList: res.data,
        });
      }).catch((err) => {
        this.setState({
          isError: PUBLIC_FEEDS_ERROR,
        });
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  componentDidCatch(error, errorInfo) {
    Raven.captureException(error, { extra: errorInfo });
  }


  handleChange = e => this.setState({
    searchRepoUsername: e.target.value,
  });

  render() {
    const {
      user: data, userFeedsError, isAuthenticated, userFeeds,
    } = this.props;
    const { repoList, isError, feedList: publicFeedList } = this.state;

    const feedList = isAuthenticated ? userFeeds : publicFeedList;


    const feedError = isError === PUBLIC_FEEDS_ERROR || userFeedsError !== null;
    const repoError = isError === USER_REPO_ERROR;

    return (
      <div
        className="row"
        ref={(re) => {
          this.homeRef = re;
        }}
      >
        <div className="col-lg-12">
          <br />
          {data && <Profile data={data} />}

          <br />
          {feedError && <div className="error"><h1>Please try again.</h1> <p>Can not fetch feeds.</p></div>}

          <FeedList feeds={feedList} />

          <br />

          {
            data &&
            <div className="input-group mr-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-default">
                 Enter Username
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                aria-label="Default"
                onChange={this.handleChange}
              />
              <button
                type="button"
                className="ml-3 btn btn-primary"
                onClick={this.getUserRepos}
              >
                Search
              </button>
            </div>
          }

          {repoError &&
          <div className="error"><h1>Please try again.</h1> <p>Can not repository list.</p></div>}

          <RepoList data={repoList} />
        </div>
      </div>
    );
  }
}

Home.defaultProps = {
  // token: null,
  user: null,
  userFeeds: null,
  userFeedsError: null,
  getInfo: () => null,
  getUserFeeds: () => null,
  isAuthenticated: localStorage.getItem('auth-token') !== undefined,
};

Home.propTypes = {
  // token: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  userFeeds: PropTypes.array,
  userFeedsError: PropTypes.string,
  getInfo: PropTypes.func,
  getUserFeeds: PropTypes.func,
  isAuthenticated: PropTypes.bool,
};

function mapState(state) {
  return {
    user: state.getIn(['github', 'user']),
    token: state.getIn(['github', 'token']),
    userFeeds: state.getIn(['github', 'userFeeds']),
    userFeedsError: state.getIn(['github', 'userFeedsError']),
    isAuthenticated: state.getIn(['github', 'isAuthenticated']),
  };
}


function mapDispatch(dispatch) {
  return bindActionCreators({
    getInfo: getUserInfo,
    getUserFeeds,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(Home);
