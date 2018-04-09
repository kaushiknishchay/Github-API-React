import React from 'react';
import PropTypes from 'prop-types';

const TabItem = ({
  name, title, active, ...props
}) => (
  <li className="nav-item" key={name} {...props}>
    <a
      className={`nav-link ${active ? 'active' : ''}`}
      id={`${name}-tab`}
      data-toggle="tab"
      href={`#${name}`}
      role="tab"
      aria-controls={name}
      aria-selected={active}
    >
      {title}
    </a>
  </li>
);

TabItem.defaultProps = {
  name: '',
  title: '',
  active: false,
};

TabItem.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  active: PropTypes.bool,
};

export default TabItem;
