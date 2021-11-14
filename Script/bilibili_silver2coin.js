/*************
 [Script]
 哔哩哔哩银瓜子换硬币.js = type=cron,cronexp=11 6 * * *,wake-system=1,timeout=60,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/Script/bilibili_silver2coin.js

 获取哔哩哔哩的cookie = type=http-request,pattern= http:\/\/m\.bilibili\.com\/space,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/Script/bilibili_silver2coin.js
 手机浏览器登录哔哩哔哩之后到【http://m.bilibili.com/space】获取cookie

 [MITM]
 hostname = bilibili.com
 **************/
const isRequest = typeof $request != "undefined"
if (isRequest) {
    let cookie = $request.headers.Cookie;
    if (!cookie) {
        $notification.post('', '', '【银瓜子换硬币】获取bilibili_cookie失败');
        $done();
    }

    let bili_jct;

    const bili_jct_reg = /bili_jct=([\w\s\d]*)/;
    bili_jct = bili_jct_reg.exec(cookie)[1];

    if (!bili_jct) {
        $notification.post('', '', '【银瓜子换硬币】获取bili_jct失败');
        $done();
    }

    $persistentStore.write(bili_jct, 'bilibili_bili_jct');
    if (!$persistentStore.read('bilibili_bili_jct')) {
        $notification.post('', '', '【银瓜子换硬币】保存【bilibili_bili_jct】失败');
        $done();
    }

    $persistentStore.write(cookie, 'bilibili_cookie');
    if (!$persistentStore.read('bilibili_cookie')) {
        $notification.post('', '', '【银瓜子换硬币】保存【bilibili_cookie】失败');
        $done();
    }

    $notification.post('', '', '【银瓜子换硬币】获取【bilibili_cookie】成功，请禁用此脚本');
    $done();
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

const bilibili_bili_jct = $persistentStore.read('bilibili_bili_jct');
if (!bilibili_bili_jct) {
    gabe.notify('', '银瓜子换硬币', '读取【bilibili_bili_jct】失败，请手机浏览器登录【http://m.bilibili.com/space】获取');
}

const bilibili_cookie = $persistentStore.read('bilibili_cookie');
if (!bilibili_cookie) {
    gabe.notify('', '银瓜子换硬币', '读取【bilibili_cookie】失败，请手机浏览器登录【http://m.bilibili.com/space】获取');
}

let options = {
    url: "https://api.live.bilibili.com/xlive/revenue/v1/wallet/silver2coin",
    headers: {
        'Cookie': bilibili_cookie,
        'Host': 'api.live.bilibili.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 NGA_skull/7.1.8',
    },
    body: "csrf_token=" + bilibili_bili_jct + "&csrf=" + bilibili_bili_jct
}

//兑换硬币
function silver2coin() {
    gabe.post(options, decodeJson);
}

//解析消息
function decodeJson(errors, response, body) {
    let data = JSON.parse(body);
    let msg = '';

    if (data.code == 0) {
        msg = data.message + '兑换硬币：' + data.data.coin + '个，剩余电池：' + data.data.gold / 100 + '个，银瓜子：' + data.data.silver + '个';
    } else {
        msg = data.message;
    }

    gabe.notify('哔哩哔哩银瓜子换硬币', '银瓜子换硬币', msg);
    console.log(body);
}

silver2coin();

$done();
