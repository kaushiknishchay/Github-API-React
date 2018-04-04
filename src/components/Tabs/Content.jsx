/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

const TabContent = ({ name, active, ...props }) => (
  <div className={`tab-pane fade${active ? ' show active' : ''}`} id={name} role="tabpanel" aria-labelledby={`${name}-tab`}>{props.children}
  </div>
);

TabContent.defaultProps = {
  name: '',
  children: null,
  active: false,
};

TabContent.propTypes = {
  name: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.bool,
  ]),
  active: PropTypes.bool,
};

export default TabContent;
