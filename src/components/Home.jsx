/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as Raven from 'raven-js';

import { getUserInfo } from '../actions';
import Profile from './Profile';
import RepoList from './RepoList';
import { getFeeds, getRepos } from '../service/httpFetch';
import FeedList from './FeedsList';
import { sentryExtra } from '../lib/utils';
import { USER_FEEDS_ERROR, USER_REPO_ERROR } from '../lib/constants';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      repoList: [],
      feedList: [],
      fetchedFeeds: false,
      isError: false,
    };
    this.getUserRepos = this.getUserRepos.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (this.props.token && !this.props.user) {
      this.props.getInfo();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      (nextState.fetchedFeeds !== this.state.fetchedFeeds) ||
            nextState.repoList !== this.state.repoList ||
            nextProps.token !== this.props.token ||
            nextProps.user !== this.props.user
    );
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
        // eslint-disable-next-line no-unused-vars
      });
    }).catch((err) => {
      // Raven.captureException(err, sentryExtra('Error while fetching user feeds'));
      this.setState({
        isError: USER_FEEDS_ERROR,
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  componentDidCatch(error, errorInfo) {
    Raven.captureException(error, { extra: errorInfo });
  }

  handleChange(e) {
    this.setState({
      username: e.target.value,
    });
  }


  render() {
    const data = this.props.user;
    const { repoList, feedList } = this.state;
    const feedError = this.state.isError === USER_FEEDS_ERROR;
    const repoError = this.state.isError === USER_REPO_ERROR;

    return (
      <div className="row">
        <div className="col-lg-12">
          <br />
          {data && <Profile data={data} />}

          <br />
          { feedError && <div><h1>Please try again.</h1> <p>Can not fetch feeds.</p></div> }

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

          { repoError && <div><h1>Please try again.</h1> <p>Can not repository list.</p></div> }

          <RepoList data={repoList} />
        </div>
      </div>
    );
  }
}

Home.defaultProps = {
  token: '',
  user: {},
  getInfo: () => {

  },
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
