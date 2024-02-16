const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function fetchWebsiteContent(url) {
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            return response.data;
        } else {
            console.error(`Failed to fetch content from ${url}. Status code: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
        return null;
    }
}

function getCountriesLinks(html) {
    const output = [];
    const $ = cheerio.load(html);
    $('a').each((index, element) => {
        const value = $(element).attr('href');
        if (value && value.includes('/tiktok-widgets/gifts/')) {
            output.push(value.replace('/tiktok-widgets/gifts/', ''));
        }
    });
    return output;
}

function getGifts(html) {
    const output = [];
    const $ = cheerio.load(html);
    const container = $('.bkg-charcoal').first();
    if (container.length) {
        container.find('.width-1').each((index, element) => {
            const imageElement = $(element).find('img').first();
            const link = imageElement.attr('src');

            const coinsElement = $(element).find('.color-white').first();
            const coins = coinsElement.text();

            const inputsElements = $(element).find('input');
            const idElement = inputsElements.eq(0);
            const nameElement = inputsElements.eq(1);

            const id = idElement.attr('value');
            const name = nameElement.attr('value');

            output.push({id: parseInt(id), name: name, image: link, diamondCost: parseInt(coins)});
        });
    } else {
        console.error('Container not found.');
    }
    return output;
}

async function loadScrappedGifts() {
    const baseUrl = 'https://streamdps.com/tiktok-widgets/gifts/';
    const pageContent = await fetchWebsiteContent(baseUrl);
    const countriesLinks = getCountriesLinks(pageContent);
    let gifts = getGifts(pageContent)
    for (let country of countriesLinks) {
        const link = baseUrl + country;
        const pageContent = await fetchWebsiteContent(link);
        gifts = gifts.concat(getGifts(pageContent));
    }
    return gifts;
}

module.exports = loadScrappedGifts;