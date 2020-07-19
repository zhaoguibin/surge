/*************
获取mixrnb的cookie = type=http-request,pattern=http:\/\/www\.mixrnb\.com\/space-uid-\d*\.html,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/rnb_getCookie.js,script-update-interval=0
访问个人空间获取到cookie，http://www.mixrnb.com/space-uid-*.html
**************/
$cookie = $request.headers.Cookie;

const saltkey_regex = /(R5nb_c8f5_saltkey=\S*)/gm;
const auth_regex = /(R5nb_c8f5_auth=(\S*));/gm;

const R5nb_c8f5_saltkey = saltkey_regex.exec($cookie);
const R5nb_c8f5_auth = auth_regex.exec($cookie);

if (!R5nb_c8f5_saltkey) {
    $notification.post('', '', '获取R5nb_c8f5_saltkey失败');
    $done();
}

if (!R5nb_c8f5_auth) {
    $notification.post('', '', '获取R5nb_c8f5_auth失败');
    $done();
}

$persistentStore.write(R5nb_c8f5_saltkey[1], 'R5nb_c8f5_saltkey');

if (!$persistentStore.read('R5nb_c8f5_saltkey')) {
    $notification.post('', '', '保存R5nb_c8f5_saltkey失败');
    $done();
}

$persistentStore.write(R5nb_c8f5_auth[1], 'R5nb_c8f5_auth');

if (!$persistentStore.read('R5nb_c8f5_auth')) {
    $notification.post('', '', '保存R5nb_c8f5_auth失败');
    $done();
}

$done();