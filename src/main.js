const loadScrappedGifts = require("./gifts-scrapper-loader");
const loadExtraGifts = require("./gifts-extra-loader");
const fs = require("fs");
const loadTikTokGifts = require("./gifts-tiktok-api");


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

    const giftsDictionary = {};
    for (let gift of gifts) {
        gift["properties"] = {}
        giftsDictionary[gift.id] = gift
    }
    console.log(" - total loaded gifts ", Object.keys(giftsDictionary).length)
    console.log("Saving to file")

    if (!fs.existsSync('./page/public')) {
        fs.mkdirSync('./page/public', {recursive: true});
    }

    const jsonData = JSON.stringify(giftsDictionary, null, 2);
    fs.writeFileSync('./page/public/gifts.json', jsonData)
    fs.writeFileSync(`./page/public/gifts-${getCurrentDate()}.json`, jsonData)
}


start()


