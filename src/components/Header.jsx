import React from 'react';
import PropTypes from 'prop-types';

export default function Header({ isSignIn, onClick }) {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <a className="navbar-brand" href="/">React GitHub API</a>
      <form className="form-inline">
        <button
          className="btn btn-md"
          type="button"
          onClick={onClick}
        >
          {!isSignIn ? 'Sign In' : 'Sign Out'}
        </button>

      </form>
    </nav>
  );
}

Header.defaultProps = {
  isSignIn: false,
};

Header.propTypes = {
  onClick: PropTypes.func.isRequired,
  isSignIn: PropTypes.bool,
};
