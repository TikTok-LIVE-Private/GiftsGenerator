const loadScrappedGifts = require("./gifts-scrapper-loader");
const loadExtraGifts = require("./gifts-extra-loader");
const fs = require("fs");
const loadTikTokGifts = require("./gifts-tiktok-loader");


function getCurrentDate() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    return `${day}-${month}-${year}`;
}

async function start() {
    console.log("Getting gifts from tiktok")
    const tiktokGifts = await loadTikTokGifts();
    console.log(" - loaded", tiktokGifts.length, "from tiktok api")
    console.log("Getting gifts from page, scrapping")
    const scrappedGifts = await loadScrappedGifts()
    console.log(" - loaded", scrappedGifts.length, "https://streamdps.com/tiktok-widgets/gifts/")
    console.log("Getting extra gifts from file")
    const extraGifts = await loadExtraGifts()
    console.log(" - loaded", extraGifts.length, "own file")

    console.log("Merging gifts")

    let gifts = scrappedGifts.concat(extraGifts)
    gifts = gifts.concat(tiktokGifts)
    console.log(" - total loaded gifts ", gifts.length)
    const giftsDictionary = {};
    for (let gift of gifts) {
        if (!('combo' in gift)) {
            gift["combo"] = "unknown"
        }

        giftsDictionary[gift.id] = gift
    }

    console.log("Saving to file")

    if (!fs.existsSync('./output')) {
        fs.mkdirSync('./output', {recursive: true});
    }

    const jsonData = JSON.stringify(giftsDictionary, null, 2);
    fs.writeFileSync('./output/gifts.json', jsonData)
    fs.writeFileSync(`./output/gifts-${getCurrentDate()}.json`, jsonData)
}


try {
    start();
} catch (e) {
    console.log("Uknown error while generating gifts")
    console.log(e)
}
