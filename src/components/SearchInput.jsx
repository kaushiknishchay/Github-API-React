import React from 'react';
import PropTypes from 'prop-types';
import { Subject } from 'rxjs';

class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    // created new Subject
    this.onSearch$ = new Subject();

    this.state = {
      query: '',
      type: '',
    };
  }

  componentDidMount() {
    const { type, query } = this.state;
    const { onClick } = this.props;
    // create the observer on subject
    this.subscription = this.onSearch$
      .filter(({ target, value }) => {
        if (target === 'query') {
          return value.length >= 3 || value.length === 0;
        }
        return true;
      })
      .debounceTime(500 /* ms */)
      .subscribe(({ target, value }) => {
        this.setState({ [target]: value });
        if (type && query && query.length >= 3) {
          onClick(type, query);
        }
      });
  }


  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onChange(e) {
    const { onChange } = this.props;
    this.onSearch$.next({ target: e.target.name, value: e.target.value });
    onChange(e);
  }

  handleSubmit(e) {
    const { type, query } = this.state;
    const { onClick } = this.props;
    e.preventDefault();
    onClick(type, query);
  }


  render() {
    const { query } = this.state;
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
            disabled={!((query.length >= 3))}
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
