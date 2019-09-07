import React from 'react';
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';

export const ErrorMsg = ({ msg, errorMsg }) => (
  <div className="alert alert-danger error">
    <h1>Please try again.</h1>
    <p>{`${msg}`}</p>
    <p>{`${errorMsg}`}</p>
  </div>
);

export const OverMsg = ({ msg }) => (<div className="alert alert-info"><p>{`${msg}`}</p></div>);
OverMsg.propTypes = {
  msg: PropTypes.string.isRequired,
};
