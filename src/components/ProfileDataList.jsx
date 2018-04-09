/* eslint-disable react/forbid-prop-types,react/default-props-match-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

const ProfileDataList = ({ data }) => {
  if (data) {
    return (
      <ul className="list-group list-group-flush">
        <li className="list-group-item"><h1>{data.name}</h1></li>
        <li className="list-group-item">Followers: {data.followers}</li>
        <li className="list-group-item">Following: {data.following}</li>
        <li className="list-group-item">Public repos: {data.public_repos}</li>
        <li className="list-group-item">Public Gists: {data.public_gists}</li>
        <li className="list-group-item">Blog: <a href={data.blog}>{data.blog}</a></li>
        <li className="list-group-item">Location: {data.location}</li>
      </ul>
    );
  }
  return '';
};
ProfileDataList.defaultProps = {
  data: {
    name: '',
    followers: 0,
    following: 0,
    public_repos: 0,
    public_gists: 0,
    blog: '',
    location: '',
  },
};
ProfileDataList.propTypes = {
  data: PropTypes.object,
};


export default ProfileDataList;
