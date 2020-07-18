/*************
获取mixrnb的cookie = type=http-request,pattern=http:\/\/www\.mixrnb\.com\/space-uid-\d*\.html,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/rnb_getCookie.js,script-update-interval=0
**************/
// $notification.post('','','匹配url测试');
$cookie = $request.headers.Cookie;
$notification.post('','',JSON.stringify($cookie));
$done();