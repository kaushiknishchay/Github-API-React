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
import SearchInput from './SearchInput';
import { PUBLIC_FEEDS_ERROR, USER_REPO_ERROR } from '../lib/constants';
import getUserFeedsList from '../lib/userFeedSelector';

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
        errorMsg: err,
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
          errorMsg: err,
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
      user: data, userFeedsError, isAuthenticated,
      getUserFeedsList: userFeeds,
    } = this.props;

    const {
      repoList, isError, feedList: publicFeedList, errorMsg,
    } = this.state;

    const feedList = isAuthenticated ? userFeeds : publicFeedList;

    const feedError = isError === PUBLIC_FEEDS_ERROR || userFeedsError !== null;
    const repoError = isError === USER_REPO_ERROR;

    return (
      <div className="row" ref={(re) => { this.homeRef = re; }}>
        <div className="col-lg-12">
          <br />
          {data && <Profile data={data} />}

          <br />
          <ul className="nav nav-tabs nav-justified" id="myTab" role="tablist">
            <li className="nav-item">
              <a
                className="nav-link active"
                id="feeds-tab"
                data-toggle="tab"
                href="#feeds"
                role="tab"
                aria-controls="feeds"
                aria-selected="true"
              >Home
              </a>
            </li>
            {
                    data &&
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        id="search-tab"
                        data-toggle="tab"
                        href="#search"
                        role="tab"
                        aria-controls="search"
                        aria-selected="false"
                      >Search Repos
                      </a>
                    </li>
              }
            {
                    data &&
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        id="profile-tab"
                        data-toggle="tab"
                        href="#profile"
                        role="tab"
                        aria-controls="profile"
                        aria-selected="false"
                      >Profile
                      </a>
                    </li>
                }
          </ul>
          <br />
          <div className="tab-content" id="myTabContent">

            <div className="tab-pane fade show active" id="feeds" role="tabpanel" aria-labelledby="feeds-tab">
              {feedError &&
              <div className="error"><h1>Please try again.</h1> <p>Can not fetch feeds.</p>
                <p>{errorMsg}</p>
              </div>
              }

              <FeedList feeds={feedList} />

            </div>

            <div className="tab-pane fade" id="search" role="tabpanel" aria-labelledby="search-tab">

              {
                  data &&
                  <SearchInput onClick={this.getUserRepos} onChange={this.handleChange} />
                }

              { repoError &&
              <div className="error"><h1>Please try again.</h1> <p>Cant fetch repository list.</p></div>
                }

              <RepoList data={repoList} />
            </div>
            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab" >
              {
                  data &&
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item"><h1>{data.name}</h1></li>
                    <li className="list-group-item">Followers: {data.followers}</li>
                    <li className="list-group-item">Following: {data.following}</li>
                    <li className="list-group-item">Public repos: {data.public_repos}</li>
                    <li className="list-group-item">Public Gists: {data.public_gists}</li>
                    <li className="list-group-item">Blog: <a href={data.blog}>{data.blog}</a></li>
                    <li className="list-group-item">Location: {data.location}</li>
                  </ul>
                }
            </div>

          </div>

        </div>
      </div>
    );
  }
}

Home.defaultProps = {
  // token: null,
  user: null,
  // userFeeds: null,
  userFeedsError: null,
  getInfo: () => null,
  getUserFeeds: () => null,
  getUserFeedsList: [],
  loginRequest: false,
  isAuthenticated: localStorage.getItem('auth-token') !== undefined,
};

Home.propTypes = {
  // token: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  // userFeeds: PropTypes.object,
  getUserFeedsList: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  userFeedsError: PropTypes.string,
  getInfo: PropTypes.func,
  getUserFeeds: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  loginRequest: PropTypes.bool,
};

function mapState(state) {
  return {
    user: state.getIn(['github', 'user']),
    token: state.getIn(['github', 'token']),
    // userFeeds: state.getIn(['github', 'userFeeds']),
    userFeedsError: state.getIn(['github', 'userFeedsError']),
    isAuthenticated: state.getIn(['github', 'isAuthenticated']),
    loginRequest: state.getIn(['github', 'loginRequest']),
    getUserFeedsList: getUserFeedsList(state),
  };
}


function mapDispatch(dispatch) {
  return bindActionCreators({
    getInfo: getUserInfo,
    getUserFeeds,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(Home);
