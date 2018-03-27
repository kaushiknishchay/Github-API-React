import React, {Component} from 'react';
import {Redirect, withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {beginSignIn} from "../actions";

class Callback extends Component {

    componentDidMount() {

        if (this.props.location && this.props.location) {
            const authCode = Callback.getAuthCode(this.props.location.search);
            const stateCode = Callback.getStateCode(this.props.location.search);
            this.props.signIn(authCode, stateCode);
        }
    }

    static getAuthCode(url) {
        const error = url.match(/[&?]error=([^&]+)/);
        if (error) {
            return "";
        }
        return url.match(/[&?]code=([\w/-]+)/)[1];
    }

    static getStateCode(url) {
        const error = url.match(/[&?]error=([^&]+)/);
        if (error) {
            return "";
        }
        if (url.includes("state"))
            return url.match(/[&?]state=([\w/-]+)/)[1];
    }

    render() {
        return (
            <div>
                Redirecting...
                {
                    this.props.isLoggedIn
                    &&
                        <Redirect to={"/"}/>
                }
            </div>
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.isSignIn !== this.props.isSignIn;
    }
}

function mapDispatch(dispatch) {
    return bindActionCreators({
        signIn: beginSignIn
    }, dispatch);
}

function mapState(state) {
    return {
        isLoggedIn: state.getIn(['github','token'])!==undefined,
    }
}

export default withRouter(connect(mapState, mapDispatch)(Callback));