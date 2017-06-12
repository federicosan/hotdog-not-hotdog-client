import axios from 'axios';
import { ImagePicker } from 'expo';

const API_DOMAIN = 'https://7bfbfdc6.ngrok.io';
const CLOUD_NAME = 'talkrise';
const UPLOAD_PRESET = 'xpyvf0by';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;




export const analyze = (uri) => {
    return axios.get(`${API_DOMAIN}/analyze`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      params: {
        uri,
      },
    })
    .then((response) => {
      return response.data.outputs[0].data.concepts.map(concept => concept.name);
    })
    .catch(() => {
      throw new Error('Something went wrong analyzing your image.');
    });
}




export const pickImage = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      noData: false,
    });

    if (result.cancelled) {
      throw new Error('Image Selection Cancelled');
    } else {
      return result;
    }
  } catch (error) {
    throw new Error('There was an issue picking your image');
  }
};




export const upload = (image) => {
  return axios.post(UPLOAD_URL, {
    file: `data:image/jpg;base64,${image.data}`,
    upload_preset: UPLOAD_PRESET,
  });
};
