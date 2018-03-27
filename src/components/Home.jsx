import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {getUserInfo} from "../actions";
import Profile from "./Profile";

class Home extends Component {


    componentDidMount() {
        if (this.props.token && !this.props.user) {
            this.props.getInfo();
        }
    }


    componentWillUpdate(nextProps, nextState) {
        if (nextProps.token && !nextProps.user) {
            this.props.getInfo();
        }
    }


    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.token !== this.props.token || nextProps.user !== this.props.user);
    }


    render() {
        let data = this.props.user;
        // console.log(data);
        return (
            <div className={"row"}>
                <div className={"col-lg-12"}>
                    <br/>
                    {data && <Profile data={data}/>}
                    <br/>
                    {
                        data &&
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">Enter Username</span>
                            </div>
                            <input type="text" className="form-control" aria-label="Default"
                                   aria-describedby="inputGroup-sizing-default"/>
                        </div>
                    }

                </div>
            </div>
        );
    }
}

function mapState(state) {
    return {
        user: state.getIn(['github', 'user']),
        token: state.getIn(['github', 'token'])
    }
}


function mapDispatch(dispatch) {
    return bindActionCreators({
        getInfo: getUserInfo
    }, dispatch);
}

export default connect(mapState, mapDispatch)(Home);
