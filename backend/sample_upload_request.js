const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Create an instance of FormData
const formData = new FormData();

// Append files to the form data
formData.append('files', fs.createReadStream(path.resolve('C:\\Users\\sanjay\\Downloads\\Parvathipuram_Map.png')));
formData.append('files', fs.createReadStream(path.resolve('C:\\Users\\sanjay\\Downloads\\Emblem_of_AP_Government.png')));

// Make a POST request to the /upload endpoint
axios.post('http://localhost:3000/uploads/upload', formData, {
    headers: {
        ...formData.getHeaders(),
    },
})
    .then(response => {
        console.log('Files uploaded successfully:', response.data);
    })
    .catch(error => {
        console.error('Error uploading files:', error);
    });