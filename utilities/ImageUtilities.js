import cloudinary from 'cloudinary-core/cloudinary-core-shrinkwrap';
import axios from 'axios';
import { ImagePicker } from 'expo';

const cloudinaryCloudName = 'talkrise';
const cl = cloudinary.Cloudinary.new({ cloud_name: cloudinaryCloudName });

export const convert = image => ({
  id: image.id,
  ticket_id: image.ticket_id,
  public_id: image.public_id,
  src: cl.url(image.public_id, {
    crop: 'fit',
    fetch_format: 'auto',
    quality: 'auto',
    secure: true,
  }),
});

export const pickImage = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      noData: false,
    });

    if (result.cancelled) {
      throw new Error();
    } else {
      return result;
    }
  } catch (error) {
    return 'There was an issue picking your image';
  }
};

export const upload = (image) => {
  const upload_url = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`;

  return axios.post(upload_url, {
    file: `data:image/jpg;base64,${image.data}`,
    upload_preset: 'xpyvf0by',
  });
};
