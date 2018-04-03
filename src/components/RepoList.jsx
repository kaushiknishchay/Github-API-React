import React from 'react';
import PropTypes from 'prop-types';

export default function RepoList(props) { // can use arrow function
  return (
    <div>
      <ul className="list-group">
        {
          // handle empty list
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

