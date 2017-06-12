import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'react-native';


const NHButton = ({ onPress, title }) => (
  <Button
    onPress={onPress}
    title={title}
  />
);

NHButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default NHButton;
