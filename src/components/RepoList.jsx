import React, {Component} from 'react';
import PropTypes from 'prop-types';

class RepoList extends Component {
    render() {
        return (
            <div>
                <ul className="list-group">
                    {
                        this.props.data && this.props.data.map(repo => {
                            return (
                                <li className="list-group-item" key={repo.id}>
                                    {repo.name}
                                </li>
                            )
                        })}
                </ul>
            </div>
        );
    }
}

RepoList.propTypes = {

};

export default RepoList;
