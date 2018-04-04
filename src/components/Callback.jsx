import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { beginSignIn } from '../actions';
import { isTokenSaved } from '../lib/utils';


class Callback extends Component {
  static getAuthCode(url) {
    const error = url.match(/[&?]error=([^&]+)/);

    return error ? '' : url.match(/[&?]code=([\w/-]+)/)[1];
  }

  componentDidMount() {
    if (this.props.location && this.props.location.search) {
      const authCode = Callback.getAuthCode(this.props.location.search);

      // condition to prevent sign in request trigger
      // if /callback?code=xxxxxxxxx url page is refreshed.

      if (!this.props.isAuthenticated &&
        (this.props.token === null || this.props.token === undefined)
        && !isTokenSaved()) {
        this.props.signIn(authCode);
      }
    }
  }

  render() {
    return (
      <div>
        Redirecting...
        {
          this.props.isLoggedIn
          && <Redirect to="/" />
        }
        {
          !this.props.isLoggedIn
          && <Redirect to="/?login_failed" />
        }
      </div>
    );
  }
}

Callback.defaultProps = {
  isLoggedIn: false,
  isAuthenticated: false,
  // isSignIn: false,
  location: {
    search: '',
  },
  signIn: code => code,
  token: '',
};

Callback.propTypes = {
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

export default withRouter(connect(mapState, mapDispatch)(Callback));
