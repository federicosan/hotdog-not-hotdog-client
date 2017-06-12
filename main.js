/**
 * GENERAL NOTES
 * @author TalkRise <admin@talkrise.com>
 */


// Module imports
import React, { Component } from 'react';
import Expo from 'expo';

import {
  ActivityIndicator,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  View,
} from 'react-native';


// Custom component imports
import NHButton from './components/NHButton';


// Utility imports
import {
  analyze,
  pickImage,
  upload,
} from './utilities/ImageUtilities';


// Initial state for component
const initialState = {
  image: null,
  isFetching: false,
  message: '',
  names: [],
};


/**
 * @class App
 * @description Entry point for application
 */
class App extends Component {

  /**
   * @constructor
   * @param props
   */
  constructor(props) {
    super(props);


    /**
     * @function _analyze
     * @description Uses 'analyze' utility to determine if an image is a hotdog. Set's
     * component state accordingly.
     * @param uri
     * @returns {Promise.<void>}
     * @private
     */
    this._analyze = async (uri) => {
      try {
        // Set message state
        this.setState({
          message: 'Analyzing...',
          names: [],
        });

        // Get image concepts from API
        const names = await analyze(uri);

        // Check for Hotdog
        const isHotdog = names.indexOf('hotdog') > -1;

        // Set state for Hotdog or Not Hotdog
        this.setState({
          isFetching: false,
          message: isHotdog ? 'HOTDOG!!!' : 'Not Hotdog :(',
          names,
        });
      } catch (error) {
        // Reset state on error
        this._reset();
        alert(error);
      }
    };


    /**
     * @function _pickImage
     * @description Uses 'pickImage' utility to grab an image from library
     * @returns {Promise.<void>}
     * @private
     */
    this._pickImage = async () => {
      try {
        // Picks the image
        const image = await pickImage();

        // Uploads the image to Cloudinary
        this._upload(image);
      } catch (error) {
        alert(error);
      }
    };


    /**
     * @function _reset
     * @description Resets component state
     * @private
     */
    this._reset = () => {
      this.setState(initialState);
    };


    /**
     * @function _upload
     * @description Uses 'upload' utility to upload image to Cloudinary
     * @param image
     * @returns {Promise.<void>}
     * @private
     */
    this._upload = async (image) => {
      try {
        // Set state accordingly
        this.setState({
          image: null,
          isFetching: true,
          message: 'Uploading...',
          names: [],
        });

        // Uploads image using utility
        const response = await upload(image);

        // Set state to include url of uploaded image
        this.setState({ image: response.data.secure_url });

        // Analyze the image
        this._analyze(response.data.secure_url);
      } catch (error) {
        this._reset();
        alert(error);
      }
    };
  }

  state = initialState;

  render() {
    const {
      image,
      isFetching,
      message,
    } = this.state;

    return (
      <ScrollView contentContainerStyle={styles.container}>

        {/*Conditionally render components*/}
        {(() => {
          // No image and not fetching, render a button to pick an image
          if (!image && !isFetching) {
            return (
              <NHButton
                onPress={this._pickImage}
                title="Select Image"
              />
            );
          } else if (!image && isFetching) return <ActivityIndicator/>; // show spinner

          // show image and reset button
          return (
            <View>
              <Image
                source={{ uri: image }}
                style={styles.image}
              />
              <NHButton
                onPress={this._reset}
                title="Reset"
              />
            </View>
          );
        })()}

        {/*Display message to user*/}
        <Text>{message}</Text>
      </ScrollView>
    );
  }
}


/**
 * @const styles
 * @description Reusable styles for application
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 250,
  },
});


Expo.registerRootComponent(App);
