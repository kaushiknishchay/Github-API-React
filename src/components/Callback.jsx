import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { beginSignIn } from '../actions';
import { isTokenSaved } from '../lib/utils';


export class CallbackC extends Component {
  static getAuthCode(url) {
    const error = url.match(/[&?]error=([^&]+)/);

    return error ? '' : url.match(/[&?]code=([\w/-]+)/)[1];
  }

  componentDidMount() {
    const {
      location, isAuthenticated, token, signIn,
    } = this.props;
    if (location && location.search) {
      const authCode = CallbackC.getAuthCode(location.search);

      // condition to prevent sign in request trigger
      // if /callback?code=xxxxxxxxx url page is refreshed.

      if (!isAuthenticated
        && (token === null || token === undefined)
        && !isTokenSaved()) {
        signIn(authCode);
      }
    }
  }

  render() {
    const { isLoggedIn } = this.props;
    return (
      <div>
        Redirecting...
        {
          isLoggedIn
            ? <Redirect to="/" />
            : <Redirect to="/?login_failed" />
        }
      </div>
    );
  }
}

CallbackC.defaultProps = {
  isLoggedIn: false,
  isAuthenticated: false,
  // isSignIn: false,
  location: {
    search: '',
  },
  signIn: code => code,
  token: '',
};

CallbackC.propTypes = {
  isLoggedIn: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  // isSignIn: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  location: PropTypes.object,
  signIn: PropTypes.func,
  token: PropTypes.string,
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    signIn: beginSignIn,
  }, dispatch);
}

function mapState(state) {
  return {
    token: state.getIn(['github', 'token']),
    isLoggedIn: state.getIn(['github', 'token']) !== undefined,
    isAuthenticated: state.getIn(['github', 'isAuthenticated']),
  };
}

export default withRouter(connect(mapState, mapDispatch)(CallbackC));
