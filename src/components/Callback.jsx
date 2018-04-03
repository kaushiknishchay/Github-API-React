import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { beginSignIn } from '../actions';


class Callback extends Component {
  static getAuthCode(url) {
    const error = url.match(/[&?]error=([^&]+)/);

    return error ? '' : url.match(/[&?]code=([\w/-]+)/)[1];
  }

  componentDidMount() {
    if (this.props.location && this.props.location.search) {
      const authCode = Callback.getAuthCode(this.props.location.search);
      // const stateCode = Callback.getStateCode(this.props.location.search);
      this.props.signIn(authCode);
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
  // isSignIn: false,
  location: {
    search: '',
  },
  signIn: code => code,
};

Callback.propTypes = {
  isLoggedIn: PropTypes.bool,
  // isSignIn: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  location: PropTypes.object,
  signIn: PropTypes.func,
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    signIn: beginSignIn,
  }, dispatch);
}

function mapState(state) {
  return {
    isLoggedIn: state.getIn(['github', 'token']) !== undefined,
  };
}

export default withRouter(connect(mapState, mapDispatch)(Callback));
