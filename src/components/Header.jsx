import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Header extends Component {
    render() {
        return (
            <nav className="navbar navbar-dark bg-dark">
                <a className="navbar-brand" href="/">React GitHub API</a>
                <form className="form-inline">
                    {
                        !this.props.isSignIn &&
                        <button
                            className="btn btn-md"
                            type="button"
                            onClick={this.props.onClick}>
                            Sign In
                        </button>
                    }
                    {
                        this.props.isSignIn &&
                        <button
                            className="btn btn-md"
                            type="button"
                            onClick={this.props.onClick}>
                            Sign Out
                        </button>
                    }
                </form>
            </nav>
        );
    }
}

Header.propTypes = {
    onSignIn: PropTypes.func,
    onClick: PropTypes.func
};

export default Header;
