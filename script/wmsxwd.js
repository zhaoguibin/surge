/*************
 [Script]
我们所向往的-签到.js = type=cron,cronexp=35 8 * * *,wake-system=1,timeout=60,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/wmsxwd.js

 获取cookie = type=http-request,pattern=https:\/\/wmsxwd\-a\.men\/user.?,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/wmsxwd.js,script-update-interval=0
 访问页面 https://wmsxwd-a.men/user
 **************/

var error, response, body;
var set_cookies = new Array();

const isRequest = typeof $request != "undefined"
if (isRequest) {

    $cookie = $request.headers.Cookie;

    if (!$cookie) {
        $notification.post('', '', '获取【我们所向往的】cookie失败');
        $done();
    }

    $persistentStore.write($cookie, 'Wmsxwd_cookie');

    if (!$persistentStore.read('Wmsxwd_cookie')) {
        $notification.post('', '', '保存【我们所向往的】cookie失败');
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
const Wmsxwd_cookie = $persistentStore.read('Wmsxwd_cookie');

if (!Wmsxwd_cookie) {
    $gabeX.notify('', '', '读取Wmsxwd_cookie失败，请先访问【https://wmsxwd-a.men/user】获取');
}

var options = {
    url: "https://wmsxwd-a.men/user/checkin",
    headers: {
        ':scheme':'https',
        'Cookie': Wmsxwd_cookie,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36 Edg/83.0.478.64',
    },
    body: {}
}

$gabeX.post(options, decodeMessage);

function decodeMessage(error, response, body) {

    var obj = eval('(' + body + ')');

    $gabeX.notify('【我们所向往的】签到提醒', '', obj.msg);
}