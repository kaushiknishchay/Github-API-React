/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-spinkit';


import withBottomScroll from '../hoc/withBottomScroll';
import FeedList from '../components/FeedsList';
import getUserFeedsList from '../lib/userFeedSelector';
import { getUserFeeds } from '../actions';
import { ErrorMsg, OverMsg } from '../components/InfoMessage';

class UserFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userFeedPageNum: 2,
    };
    this.getMoreFeeds = this.getMoreFeeds.bind(this);
  }


  componentDidMount() {
    if (this.props.user) { this.props.fetchUserFeeds(this.props.user.login); }
  }

  getMoreFeeds() {
    const { isAuthenticated, user, userFeedsError } = this.props;
    const { userFeedPageNum } = this.state;

    if (isAuthenticated && user && userFeedsError.get('type') !== 'over') {
      // if logged in fetch user feeds
      this.props.fetchUserFeeds(user.login, userFeedPageNum);
      this.setState((state, props) => ({
        userFeedPageNum: state.userFeedPageNum + 1,
      }));
    }
  }


  render() {
    const {
      userFeedsError,
      getUserFeedsList: feedList,
    } = this.props;

    const showSpinner = (feedList === null || feedList.length === 0);
    const feedError = userFeedsError.get('type') === 'error';

    const FeedListAdv = withBottomScroll(FeedList, 'feeds', this.getMoreFeeds);

    return (
      <React.Fragment>
        {feedError && <ErrorMsg msg="Can not fetch feeds." errorMsg={userFeedsError.get('msg')} />}
        {showSpinner && <Spinner name="line-scale" className="loading" />}
        <FeedListAdv feeds={feedList} getMoreFeeds={this.getMoreFeeds} />
        {userFeedsError.get('type') === 'over' && <OverMsg msg={userFeedsError.get('msg')} />}
      </React.Fragment>
    );
  }
}

UserFeed.defaultProps = {
  user: null,
  userFeedsError: {
    type: '',
    msg: '',
  },
  fetchUserFeeds: () => null,
  getUserFeedsList: [],
  isAuthenticated: localStorage.getItem('auth-token') !== undefined,
};


UserFeed.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object,
  getUserFeedsList: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  userFeedsError: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  fetchUserFeeds: PropTypes.func,
  isAuthenticated: PropTypes.bool,
};


function initMapStateToProps(state) {
  return {
    isAuthenticated: state.getIn(['github', 'isAuthenticated']),
    user: state.getIn(['github', 'user']),
    userFeedsError: state.getIn(['github', 'userFeedsError']),
    getUserFeedsList: getUserFeedsList(state),
  };
}

function initMapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchUserFeeds: getUserFeeds,
  }, dispatch);
}

export default connect(initMapStateToProps, initMapDispatchToProps)(UserFeed);
