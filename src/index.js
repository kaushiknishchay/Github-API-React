import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router} from "react-router-dom";
import rootReducer from "./reducers";
import {applyMiddleware, createStore} from "redux";
import {logger} from "redux-logger";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk, logger)));

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <App/>
        </Router>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
