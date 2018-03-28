import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";
import {createStore} from "redux";
import rootReducer from "./reducers";

jest.mock("./service/httpFetch");

const store = createStore(rootReducer);
describe('App Component', function () {

    it('==> renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <Provider store={store}>
                <Router>
                    <App/>
                </Router>
            </Provider>, div);
        ReactDOM.unmountComponentAtNode(div);
    });

});