const fs = require('fs');
const path = require('path');
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



async function loadExtraGifts()
{
    const files = fs.readdirSync('./resources');
    const fileNames = files.filter(file => fs.statSync(path.join('./resources', file)).isFile());

    let gifts = [];
    for(let fileName of fileNames)
    {
        const gifts_objects = loadJSON('./resources/'+fileName);
        gifts = gifts.concat(gifts_objects);
    }

    return gifts;
}

module.exports = loadExtraGifts;