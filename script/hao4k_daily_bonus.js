/*************
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