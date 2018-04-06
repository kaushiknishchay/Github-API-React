import React from 'react';
import PropTypes from 'prop-types';

class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      query: '',
      type: '',
    };
  }

  componentWillMount() {
    this.timer = null;
  }


  onChange(e) {
    clearTimeout(this.timer);
    this.setState({
      [e.target.name]: e.target.value,
    });

    this.props.onChange(e);

    // auto search without clicking the button
    this.timer = setTimeout(() => {
      if (this.state.query && this.state.query.length >= 3 && this.state.type) {
        this.props.onClick(this.state.type, this.state.query);
      }
    }, 1000);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onClick(this.state.type, this.state.query);
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="input-group mr-3">
          <div className="input-group-prepend">
            <select
              name="type"
              id="type"
              className="input-group-text"
              onChange={this.onChange}
              defaultValue=""
            >
              <option value="">Select</option>
              <option value="repo">Search Repos By Name</option>
              <option value="user">Find Users all repo</option>
            </select>
          </div>
          <input
            type="text"
            className="form-control"
            aria-label="Default"
            name="query"
            onChange={this.onChange}
          />
          <button
            type="button"
            className="ml-3 btn btn-primary"
            onClick={this.handleSubmit}
            disabled={!((this.state.query.length >= 3))}
          >
          Search
          </button>
        </div>
      </form>
    );
  }
}

SearchInput.propTypes = {
  onClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SearchInput;
