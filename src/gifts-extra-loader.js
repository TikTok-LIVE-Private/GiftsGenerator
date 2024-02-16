const fs = require('fs');

// Function to load JSON file into objects list
function loadJSON(filename) {
    try {
        // Read the JSON file
        const data = fs.readFileSync(filename, 'utf8');

        // Parse the JSON data
        const jsonData = JSON.parse(data);

        return jsonData;
    } catch (err) {
        console.error('Error reading JSON file:', err);
        return null;
    }
}


async function loadExtraGifts() {
    const filename = './resources/extra_gifts.json';
    return loadJSON(filename);
}

module.exports = loadExtraGifts;