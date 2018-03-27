import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import Header from "../components/Header";
import {AUTH_URL} from "../lib/constants";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {beginSignIn, signOut} from "../actions";

class HeaderContainer extends Component {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.goToAuthURL = this.goToAuthURL.bind(this);
    }


    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.isSignIn !== this.props.isSignIn;
    }


    onClick() {
        let token = localStorage.getItem('github-token');
        if (this.props.isSignIn && token !== "" && token !== "") {
            localStorage.removeItem('github-token');
            localStorage.removeItem('auth-token');
            this.props.signOut();
        } else {
            this.goToAuthURL();
        }
    }

    goToAuthURL() {
        window.location = AUTH_URL;
    }

    render() {
        let {isSignIn} = this.props;

        return (
            <Header onClick={this.onClick} isSignIn={isSignIn}/>
        );
    }
}


function mapState(state) {
    let token = state.getIn(['github', 'token']);
    return {
        token: token,
        isSignIn: token !== undefined && token !== null,
    }
}

function mapDispatch(dispatch) {
    return bindActionCreators({
        signIn: beginSignIn,
        signOut: signOut
    }, dispatch);
}

export default withRouter(connect(mapState, mapDispatch)(HeaderContainer));
