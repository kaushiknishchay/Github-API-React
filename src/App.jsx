import React from 'react';
import { Route } from 'react-router-dom';

import './App.css';
import Home from './components/Home';
import Callback from './components/Callback';
import Header from './containers/Header';

export default function App() {
  return (
    <React.Fragment>
      <Header />
      <div className="container">
        <Route path="/" exact component={Home} />
        <Route path="/callback" exact component={Callback} />
      </div>
    </React.Fragment>
  );
}

