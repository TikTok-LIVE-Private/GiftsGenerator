const axios = require('axios');
const request = require("request-promise")

module.exports = loadTikTokGifts


const url = "https://webcast.tiktok.com/webcast/gift/list/?aid=1988&app_name=tiktok_web&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0+(Windows+NT+10.0%3B+Win64%3B+x64)+AppleWebKit%2F537.36+(KHTML%2C+like+Gecko)+Chrome%2F102.0.5005.63+Safari%2F537.36&cookie_enabled=true&cursor=&device_platform=web&did_rule=3&fetch_rule=1&focus_state=true&from_page=user&history_len=4&identity=audience&internal_ext=&is_fullscreen=false&is_page_visible=true&last_rtt=0&live_id=12&msToken=&referer=https%2C+%2F%2Fwww.tiktok.com%2F&resp_content_type=protobuf&root_referer=https%2C+%2F%2Fwww.tiktok.com%2F&update_version_code=1.3.0&version_code=180800&webcast_sdk_version=1.3.0";


async function getProxiesAndTest()
{
    try {
        const response = await fetch('https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=us&anonymity=elite');
        const proxies = await response.text();
        const entries = proxies
            .split('\n')
            .map(proxy => {
                const [host, port] = proxy.split(':');
                return {host, port: parseInt(port)};
            });
        const shuffledEntries = entries.sort(() => Math.random() - 0.5);

        // Test proxies
        const successes = [];
        const failures = [];

        const timeout = 4000;

        const requests = shuffledEntries.map(entry => {
            return new Promise(async (resolve, reject) => {
                const proxyIp =  `http://${entry.host}:${entry.port}`;
                const options = {
                    method: 'GET',
                    url: 'https://api64.ipify.org',
                    proxy: proxyIp,
                    timeout:timeout,
                }
                try {
                    const response = await request(options)
                    console.log('it does works!', entry);
                    console.log(response);
                    successes.push(proxyIp);
                    resolve('Operation succeeded!');
                } catch (error) {
                    console.log("???????????????????????",error)
                }
            }, timeout);
        });
        try
        {
            await Promise.allSettled(requests);
        }
        catch (e)
        {
            console.log("error",e)
        }

        console.error('Total:', entries.length);
        console.error('Success:', successes.length);
        console.error('Failures:', failures.length);
        return successes;
    } catch (error) {
        console.error('Error:', error);
    }
    return [];
}

async function loadTikTokGifts() {

   // const workingIps = await getProxiesAndTest();
    /* console.log("Working Ips",workingIps.length)
    const randomProxy = workingIps[Math.floor(Math.random() * workingIps.length)];*/
   // const randomProxy = 'http://142.93.120.158:8000'
    const options = {
        method: 'GET',
        url: url
    }
    try {
        const response = await request(options)
        console.log(' GIFTS request succeed :)');
        console.log(response);

    } catch (error) {
        console.log('GIFTS request fail :(',error);
    }


    const axiosInstance = axios.create({

    });

    const response = await axiosInstance.get(url);
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

