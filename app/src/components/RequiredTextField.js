import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

const toSentenceCase = (word) => {
  let result = '';
  for (let i = 1; i < word.length; i++) {
    const cur = word[i];
    if (cur === cur.toUpperCase()) {
      result += ' ' + cur;
    } else {
      result += cur;
    }
  }

  result = word.charAt(0).toUpperCase() + result;
  return result;
};

const RequiredTextField = ({
  name,
  register = null,
  error = null,
  id = '',
  type = 'text',
  autoFocus = false,
  label = null,
  ...props
}) => {
  return (
    <TextField
      id={id || name}
      name={name}
      inputRef={register({ required: 'This field is required' })}
      error={!!error}
      helperText={error ? error.message : ''}
      label={label || toSentenceCase(name)}
      autoComplete="off"
      variant="outlined"
      fullWidth
      autoFocus={autoFocus}
      required
      type={type}
      {...props}
    />
  );
};

RequiredTextField.propTypes = {
  name: PropTypes.string,
  register: PropTypes.func,
  error: PropTypes.any,
  id: PropTypes.string,
  type: PropTypes.string,
  autoFocus: PropTypes.bool,
  label: PropTypes.string,
};

export default RequiredTextField;
