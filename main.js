import Expo from 'expo';
import React from 'react';

import {
  ActivityIndicator,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  View,
} from 'react-native';

import NHButton from './components/NHButton';

import {
  analyze,
  pickImage,
  upload,
} from './utilities/ImageUtilities';


const initialState = {
  image: null,
  isFetching: false,
  message: '',
  names: [],
};


class App extends React.Component {
  constructor(props) {
    super(props);

    this._analyze = async (uri) => {
      try {
        this.setState({
          message: 'Analyzing...',
          names: [],
        });
        const names = await analyze(uri);
        const isHotdog = names.indexOf('hotdog') > -1;

        this.setState({
          isFetching: false,
          message: isHotdog ? 'HOTDOG!!!' : 'Not Hotdog :(',
          names,
        });

      } catch (error) {
        this.setState({
          isFetching: false,
          message: '',
        });

        alert(error);
      }
    };

    this._pickImage = async () => {
      try {
        const image = await pickImage();
        this._upload(image);
      } catch (error) {
        alert(error);
      }
    };

    this._reset = () => {
      this.setState(initialState);
    };

    this._upload = async (image) => {
      try {
        this.setState({
          image: null,
          isFetching: true,
          message: 'Uploading...',
          names: [],
        });

        const response = await upload(image);

        this.setState({ image: response.data.secure_url });

        this._analyze(response.data.secure_url);
      } catch (error) {
        this.setState({
          isFetching: false,
          message: '',
        });
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
      names,
    } = this.state;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {(() => {
          if (!image && !isFetching) {
            return (
              <NHButton
                onPress={this._pickImage}
                title="Select Image"
              />
            );
          } else if (!image && isFetching) {
            return <ActivityIndicator/>;
          }
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
        <Text>{message}</Text>
      </ScrollView>
    );
  }
}

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
