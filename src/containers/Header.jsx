import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import { AUTH_URL } from '../lib/constants';
import { beginSignIn, signOut } from '../actions';


class HeaderContainer extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.goToAuthURL = this.goToAuthURL.bind(this);
  }


  // eslint-disable-next-line no-unused-vars
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.isSignIn !== this.props.isSignIn;
  }


  onClick() {
    const token = localStorage.getItem('auth-token');
    if (this.props.isSignIn && token !== undefined && token !== '') {
      try {
        localStorage.removeItem('auth-token');
      } catch (e) {
        console.error('Couldn\'t delete token from localStorage.');
      }
      this.props.signOut();
    } else {
      this.goToAuthURL();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  goToAuthURL() {
    window.location = AUTH_URL;
  }

  render() {
    const { isSignIn } = this.props;

    return (
      <Header onClick={this.onClick} isSignIn={isSignIn} />
    );
  }
}

HeaderContainer.defaultProps = {
  signOut: () => null,
  isSignIn: false,
};

HeaderContainer.propTypes = {
  signOut: PropTypes.func,
  isSignIn: PropTypes.bool,
};

function mapState(state) {
  const token = state.getIn(['github', 'token']);
  return {
    token,
    isSignIn: token !== undefined && token !== null,
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    signIn: beginSignIn,
    signOut,
  }, dispatch);
}

export default withRouter(connect(mapState, mapDispatch)(HeaderContainer));
