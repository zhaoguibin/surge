/*************************
 [Script]
 hifini签到.js = type=cron,cronexp=35 8 * * *,wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/hifini_sign.js

 获取hifini的cookie = type=http-request,pattern=https:\/\/www.hifini.com\/my.htm,tag=获取hifini的cookie,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/hifini_sign.js,script-update-interval=0
 个人页面获取到cookie，https://www.hifini.com/my.htm

 [MITM]
 hostname = hifini.com
 *************************/

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

const isRequest = typeof $request != "undefined"
if (isRequest) {
    let cookie = $request.headers.Cookie;

    if (!cookie) {
        $notification.post('', '', '获取cookie失败');
        $done();
    }

    $persistentStore.write(cookie, 'hifini_cookie');

    if (!$persistentStore.read('hifini_cookie')) {
        $notification.post('', '', '保存cookie失败');
        $done();
    }

    $notification.post('', '', '获取cookie成功，请禁用此脚本');
    $done();
} else {
    $done();
}
