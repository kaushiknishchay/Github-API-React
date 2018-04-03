/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { diff } from 'deep-object-diff';
import * as Raven from 'raven-js';


import { getUserInfo } from '../actions';
import Profile from './Profile';
import RepoList from './RepoList';
import { getFeeds, getPublicFeeds, getRepos } from '../service/httpFetch';
import FeedList from './FeedsList';
// import { sentryExtra } from '../lib/utils';
import { PUBLIC_FEEDS_ERROR, USER_FEEDS_ERROR, USER_REPO_ERROR } from '../lib/constants';
import SearchInput from './SearchInput';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      repoList: [],
      feedList: [],
      fetchedFeeds: false,
      publicFeeds: true,
      isError: false,
    };
    this.homeRef = null;
    this.getUserRepos = this.getUserRepos.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getPublicFeed = this.getPublicFeed.bind(this);
  }

  componentDidMount() {
    // if user logged in show his feed
    if (this.props.token && !this.props.user && localStorage.getItem('auth-token') !== undefined) {
      this.props.getInfo();
    }

    // if user not logged in show public feed
    if (!this.props.token) {
      this.getPublicFeed();
    }
  }


  shouldComponentUpdate(nextProps, nextState) {
    const propsChanged = Object.keys(diff(this.props, nextProps)).length > 0;
    const stateChanged = Object.keys(diff(this.state, nextState)).length > 0;

    return ((propsChanged || stateChanged));
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.token && !nextProps.user) {
      this.props.getInfo();
    }
    if (nextProps.user
            && this.state.fetchedFeeds === false
            && nextState.fetchedFeeds === false) {
      this.getUserFeeds(nextProps.user.login);
    }

    if (nextProps.user === null && this.state.publicFeeds === false) {
      this.getPublicFeed();
    }
  }

  componentWillUnmount() {
    this.homeRef = null;
  }

  getUserRepos() {
    getRepos(this.state.username).then((res) => {
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

  getUserFeeds(login) {
    getFeeds(`${login}`).then((res) => {
      this.setState({
        feedList: res.data,
        fetchedFeeds: true,
        publicFeeds: false,
        // eslint-disable-next-line no-unused-vars
      });
    }).catch((err) => {
      // Raven.captureException(err, sentryExtra('Error while fetching user feeds'));
      this.setState({
        isError: USER_FEEDS_ERROR,
      });
    });
  }

  getPublicFeed() {
    if (this.homeRef) {
      getPublicFeeds().then((res) => {
        this.setState({
          feedList: res.data,
          publicFeeds: true,
          fetchedFeeds: false,
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

    count = 0;

    handleChange(e) {
      this.setState({
        username: e.target.value,
      });
    }


    render() {
      const data = this.props.user;
      const { token } = this.props;
      const { repoList, feedList } = this.state;
      const feedError = this.state.isError === USER_FEEDS_ERROR;
      const repoError = this.state.isError === USER_REPO_ERROR;
      const publicFeedError = this.state.isError === PUBLIC_FEEDS_ERROR;

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
                { (!token && publicFeedError) &&
                  <div className="error"><h1>Please try again.</h1> <p>Can not fetch feeds.</p></div>
                }
                { (token && feedError) &&
                  <div className="error"><h1>Please try again.</h1> <p>Can not fetch feeds.</p></div>
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
  token: undefined,
  user: {},
  getInfo: () => null,
};

Home.propTypes = {
  token: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object,
  getInfo: PropTypes.func,
};

function mapState(state) {
  return {
    user: state.getIn(['github', 'user']),
    token: state.getIn(['github', 'token']),
  };
}


function mapDispatch(dispatch) {
  return bindActionCreators({
    getInfo: getUserInfo,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(Home);
