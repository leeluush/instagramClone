const fs = require('fs');
const path = require('path');

// Define the path to your key-service.json file
const keyFilePath = path.join(__dirname, 'key-service.json');

// Read the JSON file
const keyFileContent = fs.readFileSync(keyFilePath, 'utf8');

// Parse the JSON file content
const keyObject = JSON.parse(keyFileContent);

// Convert the key object into a single line string
const keyString = JSON.stringify(keyObject);

// Print the single line string
console.log(keyString);
