import React from 'react';
import PropTypes from 'prop-types';

const SearchInput = props => (
  <form onSubmit={props.onClick}>

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
        disabled={!((props.username.length > 0))}
      >
      Search
      </button>
    </div>
  </form>
);
SearchInput.defaultProps = {
  onChange: () => null,
  username: '',
  onClick: () => null,
};

SearchInput.propTypes = {
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  username: PropTypes.string,
};

export default SearchInput;
