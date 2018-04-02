import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { diff } from 'deep-object-diff';

import { getUserInfo } from '../actions';
import Profile from './Profile';
import RepoList from './RepoList';
import { getFeeds, getPublicFeeds, getRepos } from '../service/httpFetch';
import FeedList from './FeedsList';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      repoList: [],
      feedList: [],
      fetchedFeeds: false,
      publicFeeds: true,
    };
    this.homeRef = null;
    this.getUserRepos = this.getUserRepos.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getPublicFeed = this.getPublicFeed.bind(this);
  }

  componentDidMount() {
    // if user logged in show his feed
    if (this.props.token && !this.props.user) {
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
    });
  }

  getUserFeeds(login) {
    getFeeds(login).then((res) => {
      this.setState({
        feedList: res.data,
        fetchedFeeds: true,
        publicFeeds: false,
      });
    }).catch((err) => {
      console.log(err);
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
        console.log(err);
      });
    }
  }

    count = 0;

    handleChange(e) {
      this.setState({
        username: e.target.value,
      });
    }


    render() {
      const data = this.props.user;
      this.count = this.count + 1;
      // console.log(this.count, 'times');

      const { repoList, feedList } = this.state;
      return (
        <div className="row" ref={(re) => { this.homeRef = re; }}>
          <div className="col-lg-12">
            <br />
            {data && <Profile data={data} />}

            <br />
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
