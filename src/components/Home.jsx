import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { getUserInfo } from '../actions';
import Profile from './Profile';
import RepoList from './RepoList';
import { getRepos } from '../service/httpFetch';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      repoList: [],
    };
    this.getUserRepos = this.getUserRepos.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (this.props.token && !this.props.user) {
      this.props.getInfo();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.repoList !== this.state.repoList ||
            nextProps.token !== this.props.token ||
            nextProps.user !== this.props.user);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.token && !nextProps.user) {
      this.props.getInfo();
    }
  }


  getUserRepos() {
    getRepos(this.state.username).then((res) => {
      // console.log(res.data);
      this.setState({
        repoList: res.data,
      });
    });
  }


  handleChange(e) {
    this.setState({
      username: e.target.value,
    });
  }


  render() {
    const data = this.props.user;
    const { repoList } = this.state;
    // console.log(data);
    return (
      <div className="row">
        <div className="col-lg-12">
          <br />
          {data && <Profile data={data} />}
          <br />
          {
                        data &&
                        <div className="input-group mr-3">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-default">Enter Username</span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            aria-label="Default"
                            onChange={this.handleChange}
                          />
                          <button
                            type="button"
                            className="ml-3 btn btn-primary"
                            onClick={this.getUserRepos}
                          >
                                Search
                          </button>
                        </div>
                    }

          <RepoList data={repoList} />
        </div>
      </div>
    );
  }
}

Home.defaultProps = {
  token: '',
  user: {},
  getInfo: () => {

  },
};

Home.propTypes = {
  token: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object,
  getInfo: PropTypes.func,
};

function mapState(state) {
  return {
    user: state.getIn(['github', 'user']),
    token: state.getIn(['github', 'token']),
  };
}


function mapDispatch(dispatch) {
  return bindActionCreators({
    getInfo: getUserInfo,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(Home);
