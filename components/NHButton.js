/**
 * GENERAL NOTES
 * @author TalkRise <admin@talkrise.com>
 */


// Module imports
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';


/**
 * @const NHButton
 * @description Not Hotdog pure functional Button component
 * @param onPress
 * @param title
 * @constructor
 */
const NHButton = ({ onPress, title }) => (
  <Button
    onPress={onPress}
    title={title}
  />
);


// PropTypes
NHButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};


export default NHButton;
