/*************
 [Script]
 hao4k签到.js = type=cron,cronexp=35 8 * * *,wake-system=1,timeout=60,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/hao4k_daily_bonus.js

 获取hao4k的cookie = type=http-request,pattern=https:\/\/www.hao4k.cn\/plugin\.php\?id=k_misign:sign,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/hao4k_daily_bonus.js,script-update-interval=0
 访问签到页面 https://www.hao4k.cn/plugin.php?id=k_misign:sign
 **************/

const isRequest = typeof $request != "undefined"
if (isRequest) {
    let cookie = $request.headers.Cookie;

    if (!cookie) {
        $notification.post('', '', '获取Hao4Kcookie失败');
        $done();
    }

    $persistentStore.write(cookie, 'Hao4K_cookie');

    if (!$persistentStore.read('Hao4K_cookie')) {
        $notification.post('', '', '保存Hao4Kcookie失败');
        $done();
    }

    $notification.post('', '', '获取cookie成功，请禁用此脚本');
    $done();
}

// Modified from yichahucha
function gabeX() {
    const get = (options, callback) => {
        $httpClient.get(options, (error, response, body) => {
            callback(error, response, body)
        })
    }

    const post = (options, callback) => {
        $httpClient.post(options, (error, response, body) => {
            callback(error, response, body)
        })
    }

    const write = (value, key) => {
        return $persistentStore.write(value, key)
    }

    const read = (key) => {
        return $persistentStore.read(key)
    }

    const notify = (title, subtitle, message) => {
        $notification.post(title, subtitle, message)
        $done();
    }

    return {
        get,
        post,
        write,
        read,
        notify
    }
}

let gabe = gabeX();

//cookie
const Hao4K_cookie = $persistentStore.read('Hao4K_cookie');

if (!Hao4K_cookie) {
    gabe.notify('', '', '读取Hao4K_cookie失败，请先访问[https://www.hao4k.cn/plugin.php?id=k_misign:sign]获取');
}

let options = {
    url: "https://www.hao4k.cn",
    headers: {
        'Cookie': Hao4K_cookie,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36 Edg/83.0.478.64',
    },
    body: {}
}

function getFormHash(error, response, body) {
    const regex = /<a\shref="member\.php\?mod=logging&amp;action=logout&amp;formhash=(\w*)\">/gm;
    const formhash = regex.exec(body)[1];
    if (!formhash) {
        gabe.notify('', '', '获取formhash失败');
    }

    options.url = 'https://www.hao4k.cn/plugin.php?id=k_misign:sign&operation=qiandao&format=empty&inajax=1&ajaxtarget=JD_sign&formhash=' + formhash;

    gabe.get(options, function () {
        gabe.get(options, decodeXml);
    });
}

function decodeXml(error, response, body) {
    //查看是否登录过期或者没登录
    let message = '签到出错';
    if (body.length < 75) {
        message = '签到成功';
    }

    gabe.notify('Hao4k签到提醒', '', message);
}

gabe.get(options, getFormHash);

$done();
