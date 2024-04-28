/*************************
 [Script]
 hifini签到.js = type=cron,cronexp=35 8 * * *,wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/Script/hifini_sign.js,script-update-interval=0

 获取hifini的cookie&&sign = type=http-response,pattern=https:\/\/www\.hifini\.com\/sg_sign\.htm,tag=获取hifini的sign,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/Script/hifini_sign.js,requires-body=1,max-size=0,debug=0
 个人页面获取到cookie，https://www.hifini.com/sg_sign.htm

 [MITM]
 hostname = *hifini.com*
 *************************/

const isRequest = typeof $request != "undefined"
if (isRequest) {
    let cookie = $request.headers.Cookie;

    if (!cookie) {
        $notification.post('HIFINI签到', '', '获取cookie失败');
        $done({});//使用 $done();中止请求而不返回任何内容。或者使用 $done({});保持请求不变。
    }

    $persistentStore.write(cookie, 'hifini_cookie');

    if (!$persistentStore.read('hifini_cookie')) {
        $notification.post('HIFINI签到', '', '保存cookie失败');
        $done({});
    }

    body = $response.body;
    const sign_reg = /var\ssign\s=\s"(.*)"/;
    sign = sign_reg.exec(body)[1];

    if (!sign) {
        $notification.post('HIFINI签到', '', '获取sign失败');
        $done({});
    }

    $persistentStore.write(sign, 'hifini_sign');
    if (!$persistentStore.read('hifini_sign')) {
        $notification.post('HIFINI签到', '', '保存sign失败');
        $done({});
    }

    $notification.post('HIFINI签到', '', '获取cookie成功，请禁用此脚本');
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
const sign = function () {
    let cookie = $persistentStore.read('hifini_cookie');
    if (!cookie) {
        gabe.notify('HIFINI签到', '', '获取cookie失败');
    }

    let sign = $persistentStore.read('hifini_sign');
    if (!sign) {
        gabe.notify('HIFINI签到', '', '获取sign失败');
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
        body: 'sign=' + sign
    }

    return new Promise(function (resolve, reject) {
        gabe.post(options, function (errors, response, body) {
            let msg = '';
            if (errors) {
                msg = '签到失败:' + errors;
            }
            let obj = JSON.parse(body);
            if (obj.code == 1) {
                msg = obj.message;
            } else {
                msg = obj.message;
            }
            resolve(msg);
        });
    });
}

async function startSign() {
    let title = 'HIFINI签到';
    let subTitle = '';
    let message = '';
    message = await sign();
    gabe.notify(title, subTitle, message);
    $done();
}

startSign();
