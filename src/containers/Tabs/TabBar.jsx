/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TabItem from '../../components/Tabs/Item';

const TabBar = ({ user }) => (
  <div>
    <br />
    <ul className="nav nav-tabs nav-justified" id="myTab" role="tablist">
      <TabItem name="feeds" title={user ? 'My Feeds' : 'Public Feeds'} active />
      { user && [
        <TabItem name="search" key="search" title="Search" />,
        <TabItem name="profile" key="profile" title="Profile" />]
      }
    </ul>
  </div>
);

TabBar.defaultProps = {
  user: null,
};

TabBar.propTypes = {
  user: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    user: state.getIn(['github', 'user']),
  };
}

export default connect(mapStateToProps, null)(TabBar);
