const axios = require('axios');


module.exports = loadTikTokGifts


const url = "https://webcast.tiktok.com/webcast/gift/list/?aid=1988&app_name=tiktok_web&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0+(Windows+NT+10.0%3B+Win64%3B+x64)+AppleWebKit%2F537.36+(KHTML%2C+like+Gecko)+Chrome%2F102.0.5005.63+Safari%2F537.36&cookie_enabled=true&cursor=&device_platform=web&did_rule=3&fetch_rule=1&focus_state=true&from_page=user&history_len=4&identity=audience&internal_ext=&is_fullscreen=false&is_page_visible=true&last_rtt=0&live_id=12&msToken=&referer=https%2C+%2F%2Fwww.tiktok.com%2F&resp_content_type=protobuf&root_referer=https%2C+%2F%2Fwww.tiktok.com%2F&update_version_code=1.3.0&version_code=180800&webcast_sdk_version=1.3.0";


async function loadTikTokGifts() {
    const response = await axios.get(url);
    const responseData = response.data;
    const result = [];
    for (let gift of responseData.data.gifts) {
        let link = gift.image.url_list[1]
        let name = gift.name;
        let id = gift.id;
        let cost = gift.diamond_count;
        let combo = gift.combo;

        result.push({id: parseInt(id), name: name, image: link, diamondCost: parseInt(cost), combo: combo});
    }
    return result;
}

