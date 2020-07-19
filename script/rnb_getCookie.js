/*************
获取mixrnb的cookie = type=http-request,pattern=http:\/\/www\.mixrnb\.com\/space-uid-\d*\.html,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/rnb_getCookie.js,script-update-interval=0
**************/
// $notification.post('','','匹配url测试');
$cookie = $request.headers.Cookie;

const saltkey_regex = /(R5nb_c8f5_saltkey=\S*)/gm;
const auth_regex = /(R5nb_c8f5_auth=(\S*);)/gm;

const R5nb_c8f5_saltkey = saltkey_regex.exec($cookie);

$notification.post('','',JSON.stringify(R5nb_c8f5_saltkey));
// console.log($cookie);
$done();