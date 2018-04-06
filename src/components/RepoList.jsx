import React from 'react';
import PropTypes from 'prop-types';

const RepoList = ({ data }) => (
  <div>
    <ul className="list-group">
      {
          data && data.map(repo => (
            <a
              href={repo.html_url}
              key={repo.id}
              className="list-group-item list-group-item-action flex-column align-items-start"
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{repo.name}</h5>
                <span>
                    &#9733; {repo.watchers_count}
                </span>
              </div>
              <p className="mb-1">{repo.description}</p>
            </a>
          ))
        }
    </ul>
  </div>
);

RepoList.propTypes = {
// eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
};

export default RepoList;
