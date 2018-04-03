import React from 'react';
import PropTypes from 'prop-types';

const SearchInput = props => (
  <div className="input-group mr-3">
    <div className="input-group-prepend">
      <span className="input-group-text" id="inputGroup-sizing-default">
              Enter Username
      </span>
    </div>
    <input
      type="text"
      className="form-control"
      aria-label="Default"
      onChange={props.onChange}
    />
    <button
      type="button"
      className="ml-3 btn btn-primary"
      onClick={props.onClick}
    >
            Search
    </button>
  </div>
);
SearchInput.defaultProps = {
  onChange: () => null,
  onClick: () => null,
};

SearchInput.propTypes = {
  onChange: PropTypes.func,
  onClick: PropTypes.func,
};

export default SearchInput;
