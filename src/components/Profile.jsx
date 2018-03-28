/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

export default function Profile(props) {
  const { data } = props;
  return (
    <div className="media card">
      <br />
      <img className="mr-3" src={data.avatar_url} height={100} alt={data.login} />
      <div className="card-body">
        <h5 className="mt-0">{data.login}</h5>
        {data.bio}
      </div>
    </div>
  );
}

Profile.propTypes = {
  data: PropTypes.object.isRequired,
};

