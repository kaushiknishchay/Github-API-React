import React, {Component} from "react";
import "./App.css";
import Home from "./components/Home";
import Callback from "./components/Callback";
import {Route} from 'react-router-dom';
import Header from "./containers/Header";

class App extends Component {

    render() {
        return (
            <React.Fragment>
                <Header/>
                <div className="container">
                    <Route path="/" exact component={Home}/>
                    <Route path="/callback" exact component={Callback}/>
                </div>
            </React.Fragment>
        );
    }
}

export default App;
