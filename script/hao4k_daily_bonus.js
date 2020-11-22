/*************
[Script]
hao4k签到.js = type=cron,cronexp=35 8 * * *,wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/hao4k_daily_bonus.js

获取hao4k的cookie = type=http-request,pattern=https:\/\/www.hao4k.cn\/plugin\.php\?id=k_misign:sign,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/hao4k_daily_bonus.js,script-update-interval=0
访问签到页面 https://www.hao4k.cn/plugin.php?id=k_misign:sign
**************/

var error, response, body;
var set_cookies = new Array();

const isRequest = typeof $request != "undefined"
if (isRequest) {
    $cookie = $request.headers.Cookie;

    if (!$cookie) {
        $notification.post('', '', '获取Hao4Kcookie失败');
        $done();
    }

    $persistentStore.write($cookie, 'Hao4K_cookie');

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

var $gabeX = gabeX();

//cookie
const Hao4K_cookie = $persistentStore.read('Hao4K_cookie');
const Message_str = '';

if (!Hao4K_cookie) {
    $gabeX.notify('', '', '读取Hao4K_cookie失败，请先访问[https://www.hao4k.cn/plugin.php?id=k_misign:sign]获取');
}

var options = {
    url: "https://www.hao4k.cn//plugin.php?id=k_misign:sign&operation=qiandao&formhash=f96403f0&format=empty&inajax=1&ajaxtarget=JD_sign",
    headers: {
        'Cookie': Hao4K_cookie,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36 Edg/83.0.478.64',
    },
    body: {}
}

function decodeXml(error, response, body) {

    //查看是否登录过期或者没登录
    var message = '签到出错，请查看日志';
    if (body.match('未定义操作')) {
        message = '未登录或者cookie失效，请重新获取cookie';
    }

    if (body.match('今日已签')) {
        message = '您今日已经签到，请明天再来！';
    }

    Message_str += message;
    console.log(body);
}

setTimeout(function () {
    $gabeX.get(options, decodeXml);
}, 1000);

setTimeout(function () {
    $gabeX.get(options, decodeXml);
}, 2000);

$gabeX.notify('hao4k签到提醒', '', Message_str);

$done();