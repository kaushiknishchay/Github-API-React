/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import Raven from 'raven-js'; // Or, you might already have this as `window.Raven`.
import { BrowserRouter as Router } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import { logger } from 'redux-logger';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createRavenMiddleware from 'raven-for-redux';

import './index.css';
import App from './App';
import rootReducer from './reducers';
import registerServiceWorker from './registerServiceWorker';

Raven.config('https://ff415653dd0b41bd951cf8e3e19cf703@sentry.io/768696').install();

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(
  thunk, logger,
  createRavenMiddleware(Raven),
)));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
  , document.getElementById('root'),
);
registerServiceWorker();
