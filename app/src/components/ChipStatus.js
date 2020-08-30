import React from 'react';
import PropTypes from 'prop-types';
import { Chip, colors } from '@material-ui/core';

const ChipStatus = ({ label }) => {
  const color =
    label?.toUpperCase() === 'PAID' ? colors.green[800] : colors.red[900];

  return (
    <Chip
      color="primary"
      label={label}
      style={{ width: '6rem', backgroundColor: color, fontWeight: 'bold' }}
    />
  );
};
ChipStatus.propTypes = {
  label: PropTypes.string
};

export default ChipStatus;
