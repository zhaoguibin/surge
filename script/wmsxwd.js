/*************
 [Script]
我们所向往的-签到.js = type=cron,cronexp=35 8 * * *,wake-system=1,timeout=60,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/wmsxwd.js

 获取cookie = type=http-request,pattern=https:\/\/wmsxwd-a\.men\/user,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/wmsxwd.js,script-update-interval=0
 访问页面 https://wmsxwd-a.men/user
 **************/

var error, response, body;
var set_cookies = new Array();

const isRequest = typeof $request != "undefined"
if (isRequest) {
    // $cookie = $request.headers.cookie;
    //
    // if (!$cookie) {
    //     $notification.post('', '', '获取【我们所向往的】cookie失败');
    //     $done();
    // }
    //
    // $persistentStore.write($cookie, 'Wmsxwd_cookie');
    //
    // if (!$persistentStore.read('Wmsxwd_cookie')) {
    //     $notification.post('', '', '保存【我们所向往的】cookie失败');
    //     $done();
    // }
    //
    // $notification.post('', '', '获取cookie成功，请禁用此脚本');
    $notification.post('', '', '77777');
    $done();
}