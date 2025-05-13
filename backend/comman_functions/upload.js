const axios = require('axios');
const FormData = require('form-data');

async function uploadJsonToPinata(data) {
  if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_API_KEY) {
    throw new Error('Pinata API credentials are missing');
  }

  const formData = new FormData();
  const jsonData = JSON.stringify(data);
  formData.append('file', Buffer.from(jsonData, 'utf-8'), {
    filename: `${data.ticket_id}.json`,
    contentType: 'application/json',
  });

  const pinataOptions = JSON.stringify({ cidVersion: 1 });
  const pinataMetadata = JSON.stringify({ name: `${data.ticket_id}` });

  formData.append('pinataOptions', pinataOptions);
  formData.append('pinataMetadata', pinataMetadata);

  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading JSON to Pinata:', error.response?.data || error.message);
    throw new Error('Error uploading to Pinata');
  }
}

module.exports = uploadJsonToPinata;
