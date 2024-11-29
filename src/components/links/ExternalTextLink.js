import React from 'react';
import { PropTypes } from 'prop-types';
import { ExternalLink } from 'react-feather';

const ExternalTextLink = ({ url, text, type }) => (
  <div
    className={`d-flex justify-content-start align-items-center text-${type}`}
  >
    <a target="_blank" href={url} rel="noreferrer">
      <ExternalLink />
      <span className="ml-1">{text}</span>
    </a>
  </div>
);

ExternalTextLink.propTypes = {
  url: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.string,
};

ExternalTextLink.defaultProps = {
  type: 'success',
};

export default ExternalTextLink;
