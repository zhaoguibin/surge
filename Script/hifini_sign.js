/*************************
 [Script]
 hifini签到.js = type=cron,cronexp=35 8 * * *,wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/hifini_sign.js

 获取hifini的cookie = type=http-request,pattern=https:\/\/www\.hifini\.com\/my\.htm,tag=获取hifini的cookie,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/hifini_sign.js,script-update-interval=0
 个人页面获取到cookie，https://www.hifini.com/my.htm

 [MITM]
 hostname = *hifini.com*
 *************************/

const isRequest = typeof $request != "undefined"
//判断请求url是否包含my.htm
const url_compare = $request.url.indexOf('my.htm') > 0;
if (isRequest && url_compare) {
    let cookie = $request.headers.Cookie;

    if (!cookie) {
        $notification.post('', '', '获取cookie失败');
        $done({});//使用 $done();中止请求而不返回任何内容。或者使用 $done({});保持请求不变。
    }

    $persistentStore.write(cookie, 'hifini_cookie');

    if (!$persistentStore.read('hifini_cookie')) {
        $notification.post('', '', '保存cookie失败');
        $done({});
    }

    $notification.post('', '', '获取cookie成功，请禁用此脚本');
    $done({});
}

// Modified from yichahucha
function gabeX() {
    const get = (options, callback) => {
        $httpClient.get(options, (error, response, body) => {
            callback(error, response, body)
        })
    };
    const post = (options, callback) => {
        $httpClient.post(options, (error, response, body) => {
            callback(error, response, body)
        })
    };
    const write = (value, key) => {
        return $persistentStore.write(value, key)
    };
    const read = (key) => {
        return $persistentStore.read(key)
    };
    const notify = (title, subtitle, message) => {
        $notification.post(title, subtitle, message);
        $done()
    };
    return {get, post, write, read, notify}
}

let gabe = gabeX();

//签到
function sign() {
    let cookie = $persistentStore.read('hifini_cookie');
    if (!cookie) {
        gabe.notify('', '', '获取cookie失败');
    }

    let options = {
        url: "https://www.hifini.com/sg_sign.htm",
        headers: {
            'Cookie': cookie,
            'Accept': 'text/plain, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://www.hifini.com',
            'Pragma': 'no-cache',
            'Priority': 'u=1, i',
            'Referer': 'https://www.hifini.com/',
            'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"macOS"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: {'sign': '759adb6395c8ab7f5384055704359bcf7771185cf588c41fdcb7443a36a3b888'}
    }

    gabe.post(options, result);
}

function result(error, response, body) {
    if (error) {
        gabe.notify('', '', 'HIFINI签到失败');
    }
    let obj = JSON.parse(body);
    if (obj.code == 1) {
        gabe.notify('', '', obj.message);
    } else {
        gabe.notify('', '', obj.message);
    }
}

sign();

$done();
