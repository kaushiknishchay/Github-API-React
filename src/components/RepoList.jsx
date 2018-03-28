import React from 'react';
import PropTypes from 'prop-types';

export default function RepoList(props) {
  return (
    <div>
      <ul className="list-group">
        {
            props.data && props.data.map(repo => (
              <li className="list-group-item" key={repo.id}>
                {repo.name}
              </li>
            ))
        }
      </ul>
    </div>
  );
}


RepoList.propTypes = {
// eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
};

