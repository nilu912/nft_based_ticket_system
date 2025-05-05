// uploadJsonToPinata.js
const axios = require('axios');
const FormData = require('form-data');

// Function to upload JSON data to Pinata
async function uploadJsonToPinata(data) {
  const formData = new FormData();
  const jsonData = JSON.stringify(data); // JSON data you want to upload
  formData.append('file', Buffer.from(jsonData, 'utf-8'), {
    filename: `${data.ticket_id}.json`,
    contentType: 'application/json',
  });

  const pinataOptions = JSON.stringify({
    cidVersion: 1,
  });

  formData.append('pinataOptions', pinataOptions);

  try {
    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'pinata_api_key': process.env.PINATA_API_KEY,
        'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY,
      },
    });
    return response.data.IpfsHash; // The CID of the uploaded file
  } catch (error) {
    console.error('Error uploading JSON to Pinata:', error.message);
    throw new Error('Error uploading to Pinata');
  }
}

module.exports = uploadJsonToPinata;

// const axios = require('axios');
// const FormData = require('form-data');
// const fs = require('fs');
// const { env } = require('process');

// // Pinata API Credentials
// const PINATA_API_KEY = process.env.PINATA_API_KEY;
// const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

// // Function to Upload File to Pinata
// const uploadToPinata = async (filePath) => {
//     const formData = new FormData();
//     formData.append('file', fs.createReadStream(filePath));

//     const pinataMetadata = JSON.stringify({
//         name: 'MyFile',
//     });

//     formData.append('pinataMetadata', pinataMetadata);

//     const pinataOptions = JSON.stringify({
//         cidVersion: 1,
//     });

//     formData.append('pinataOptions', pinataOptions);

//     try {
//         const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
//             headers: {
//                 'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
//                 'pinata_api_key': PINATA_API_KEY,
//                 'pinata_secret_api_key': PINATA_SECRET_API_KEY,
//             },
//         });

//         console.log('File uploaded successfully!');
//         console.log('CID:', response.data.IpfsHash); // The hash of the uploaded file
//         return response.data.IpfsHash;
//     } catch (error) {
//         console.error('Error uploading file to Pinata:', error.response ? error.response.data : error.message);
//     }
// };

// // Call the function with your file path
