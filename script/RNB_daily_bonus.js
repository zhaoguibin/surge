/*************************
 [Script]
 mixRnb签到.js = type=cron,cronexp=35 8 * * *,wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/RNB_daily_bonus.js

 获取mixRnb的cookie = type=http-request,pattern=http:\/\/www.mixrnb.com\/plugin\.php\?id=dsu_paulsign:sign,tag=获取mixRnb的cookie,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/RNB_daily_bonus.js,script-update-interval=0
 签到页面获取到cookie，http://www.mixrnb.com/plugin.php?id=dsu_paulsign:sign
 *************************/
let set_cookies = [];

const isRequest = typeof $request != "undefined"
if (isRequest) {
    let cookie = $request.headers.Cookie;

    const saltKey_regex = /(R5nb_c8f5_saltKey=\S*)/gm;
    const auth_regex = /(R5nb_c8f5_auth=(\S*));/gm;
    const R5nb_c8f5_saltKey = saltKey_regex.exec(cookie);
    const R5nb_c8f5_auth = auth_regex.exec(cookie);

    if (!R5nb_c8f5_saltKey) {
        $notification.post('', '', '获取R5nb_c8f5_saltKey失败');
        $done();
    }

    if (!R5nb_c8f5_auth) {
        $notification.post('', '', '获取R5nb_c8f5_auth失败');
        $done();
    }

    $persistentStore.write(R5nb_c8f5_saltKey[1], 'R5nb_c8f5_saltKey');

    if (!$persistentStore.read('R5nb_c8f5_saltKey')) {
        $notification.post('', '', '保存R5nb_c8f5_saltKey失败');
        $done();
    }

    $persistentStore.write(R5nb_c8f5_auth[1], 'R5nb_c8f5_auth');

    if (!$persistentStore.read('R5nb_c8f5_auth')) {
        $notification.post('', '', '保存R5nb_c8f5_auth失败');
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

let $gabeX = gabeX();

//cookie
const R5nb_c8f5_auth = $persistentStore.read('R5nb_c8f5_auth');
const saltKey = $persistentStore.read('R5nb_c8f5_saltKey');

if (!saltKey) {
    $gabeX.notify('', '', '读取R5nb_c8f5_saltKey失败，请先访问个人空间【http://www.mixrnb.com/space-uid-*.html】获取');
}

if (!R5nb_c8f5_auth) {
    $gabeX.notify('', '', '读取R5nb_c8f5_auth失败，请先访问个人空间【http://www.mixrnb.com/space-uid-*.html】获取');
}

let options = {
    url: "http://www.mixrnb.com/plugin.php?id=dsu_paulsign:sign",
    headers: {
        'Cookie': R5nb_c8f5_auth + ';' + saltKey,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36 Edg/83.0.478.64',
    },
    body: {}
}

function getSecuritySessionVerify(error, response, body) {
    let set_cookie = response['headers']['Set-Cookie'];
    set_cookies = set_cookie.split(";"); //字符分割

    if (!set_cookies) {
        $gabeX.notify('', '', '获取SecuritySessionVerify失败');
    }

    options.headers.Cookie += ';' + set_cookies[0];
    options.url += '&security_verify_data=313932302c31303830';

    $gabeX.get(options, getSecuritySessionMidVerify);
}

function getSecuritySessionMidVerify(error, response, body) {
    let set_cookie = response['headers']['Set-Cookie'];
    set_cookies = set_cookie.split(";"); //字符分割

    if (!set_cookies) {
        $gabeX.notify('', '', '获取SecuritySessionMidVerify失败');
    }

    options.headers.Cookie += ';' + set_cookies[0];

    $gabeX.get(options, getFormHash);
}

function getFormHash(error, response, body) {
    const regex = /^<li><a\shref=\"member\.php\?mod=logging&amp;action=logout&amp;formhash=(\w*)\">.*<\/a><\/li>$/gmi;
    const formhash = regex.exec(body)[1];
    if (!formhash) {
        $gabeX.notify('', '', '获取formhash失败');
    }
    options.url = 'http://www.mixrnb.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1';
    options.body = 'formhash=' + formhash + '&qdxq=kx'
    options['headers']['Content-Type'] = 'application/x-www-form-urlencoded'

    $gabeX.post(options, decodeXml);
}

function decodeXml(error, response, body) {
    //查看是否登录过期或者没登录
    let message = '签到出错，请查看日志';
    if (body.match('ÄúÐèÒªÏÈµÇÂ¼²ÅÄÜ¼ÌÐø±¾²Ù×÷')) {
        message = '未登录或者cookie失效，请重新获取cookie';
    }

    if (body.match('¹§Ï²ÄãÇ©µ½³É¹¦!')) {
        message = '恭喜你签到成功!';
    }

    if (body.match('Äú½ñÈÕÒÑ¾­Ç©µ½£¬ÇëÃ÷ÌìÔÙÀ´£¡ ')) {
        message = '您今日已经签到，请明天再来！';
    }

    $gabeX.notify('mixRnb签到提醒', '', message);

}

$gabeX.get(options, getSecuritySessionVerify);

$done();