import React from 'react';
import PropTypes from 'prop-types';

export default function Header(props) {// can we use destructing here to get only the props needed like ({isSignIn, onClick}) => {...}
  return (
    <nav className="navbar navbar-dark bg-dark">
      <a className="navbar-brand" href="/">React GitHub API</a>
      <form className="form-inline">

      //  user ternary operator and just change the button lable like props.isSignIn ? 'Sign in' : 'Sign Out'
        {
                        !props.isSignIn &&
                        <button
                          className="btn btn-md"
                          type="button"
                          onClick={props.onClick}
                        >
                            Sign In
                        </button>
                    }
        {
                        props.isSignIn &&
                        <button
                          className="btn btn-md"
                          type="button"
                          onClick={props.onClick}
                        >
                            Sign Out
                        </button>
                    }
      </form>
    </nav>
  );
}

Header.defaultProps = {
  onClick: e => e,
  isSignIn: false,
};

Header.propTypes = {
  onClick: PropTypes.func,
  isSignIn: PropTypes.bool,
};
