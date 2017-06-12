import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import axios from 'axios';

import {
  convert,
  pickImage,
  upload,
} from './utilities/ImageUtilities';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.analyze = (uri) => {
      axios.get('https://ea9251dc.ngrok.io/analyze', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        params: {
          uri,
        },
      })
      .then((response) => {
        const names = response.data.outputs[0].data.concepts.map(concept => concept.name);
        const includesHotdog = names.indexOf('hotdog') > -1;
        console.log(includesHotdog);
      })
      .catch((error) => {
        console.log('ERROR: ' + JSON.stringify(error));
      });
    };

    this.pickImage = async () => {
      const image = await pickImage();
      this.upload(image);
    };

    this.upload = (image) => {
      upload(image)
        .then((response) => {
          this.analyze(response.data.secure_url);
        })
        .catch((error) => {
          console.log('ERROR: ' + JSON.stringify(error));
        });
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.pickImage();
    }, 5000);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up main.js to start working on your app!</Text>
      </View>
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
});

Expo.registerRootComponent(App);
