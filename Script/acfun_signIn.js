/*************
 [Script]
acfun签到 = type=cron,cronexp=11 8 * * *,wake-system=1,timeout=60,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/Script/acfun_signIn.js,script-update-interval=0

 获取acfun的cookie = type=http-request,pattern= .+\.acfun\.cn\/rest\/app\/user\/personalInfo.+,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/acfun_signIn.js,script-update-interval=0
 手机app签到一次，获取签到所需要的cookie和其他配置信息

 [MITM]
 hostname = *acfun.cn
 **************/
const isRequest = typeof $request != "undefined";
if (isRequest) {
    const ks_ipv6_cellular_reg = /ks_ipv6_cellular=(\d\w.*?)&/;
    const sys_version_reg = /sys_version=(\d\w.*?)&/;

    let acfun_params = {
        'cookie': $request.headers.Cookie,
        'user_agent': $request.headers['User-Agent'],
        'random': $request.headers.random,
        'device_type': $request.headers.deviceType,
        'market': $request.headers.market,
        'url_page': $request.headers.url_page,
        'app_version': $request.headers.appVersion,
        'resolution': $request.headers.resolution,
        'acPlatform': $request.headers.acPlatform,
        'udid': $request.headers.udid,
        'sign': $request.headers.sign,
        'net': $request.headers.net,
        'token': $request.headers.token,
        'uid': $request.headers.uid,
        'mod': $request.headers.mod,
        'isp': $request.headers.isp,
        'product_id': $request.headers.productId,
        'gid': $request.headers.gid,
        'access_token': $request.headers.access_token,
        'idfa': $request.headers.idfa,
        'ks_ipv6_cellular': ks_ipv6_cellular_reg.exec($request.url)[1],
        'sys_version': sys_version_reg.exec($request.url)[1]
    }

    for (let key in acfun_params) {
        if (!acfun_params[key]) {
            $notification.post('', '', '获取acfun_' + acfun_params[key] + '失败');
            $done();
        }
    }

    $persistentStore.write(JSON.stringify(acfun_params), 'acfun_params');
    if (!$persistentStore.read('acfun_params')) {
        $notification.post('', '', '保存acfun_params失败');
        $done();
    }

    $notification.post('', '', '获取【acfun_params】成功，请禁用此脚本');
    $done();
}

// Modified from yichahucha
function gabeX() { const get = (options, callback) => { $httpClient.get(options, (error, response, body) => { callback(error, response, body) }) }; const post = (options, callback) => { $httpClient.post(options, (error, response, body) => { callback(error, response, body) }) }; const write = (value, key) => { return $persistentStore.write(value, key) }; const read = (key) => { return $persistentStore.read(key) }; const notify = (title, subtitle, message) => { $notification.post(title, subtitle, message); $done() }; return { get, post, write, read, notify } }

let gabe = gabeX();

let acfun_params = $persistentStore.read('acfun_params');
if (!acfun_params) {
    gabe.notify('', '', '读取acfun_params失败');
    $done();
}

acfun_params = JSON.parse(acfun_params);

function signIn() {
    let options = {
        url: "https://api-ipv6.app.acfun.cn/rest/app/user/signIn?market=" + acfun_params.market + "&app_version=" + acfun_params.app_version + "&product=ACFUN_APP&sys_version=" + acfun_params.sys_version + "&egid=" + acfun_params.gid + "&origin=ios&ftt=&ks_ipv6_cellular=" + acfun_params.ks_ipv6_cellular + "&npr=0&sys_name=ios&resolution=" + acfun_params.resolution + "&access_token=" + acfun_params.access_token,
        headers: {
            'Host': 'api-ipv6.app.acfun.cn',
            'Cookie': acfun_params.cookie,
            'language': 'zh-Hans-CN;q=1',
            'User-Agent': acfun_params.user_agent,
            'random': acfun_params.random,
            'deviceType': acfun_params.device_type,
            'market': acfun_params.market,
            'url_page': acfun_params.url_page,
            'appVersion': acfun_params.app_version,
            'resolution': acfun_params.resolution,
            'acPlatform': acfun_params.acPlatform,
            'udid': acfun_params.udid,
            'Content-Length': 0,
            'sign': acfun_params.sign,
            'net': acfun_params.net,
            'token': acfun_params.token,
            'uid': acfun_params.uid,
            'mod': acfun_params.mod,
            'isp': acfun_params.isp,
            'productId': acfun_params.product_id,
            'Accept-Language': 'zh-Hans - CN; q=1',
            'isChildPattern': false,
            'gid': acfun_params.gid,
            'Connection': 'keep-alive',
            'Accept': 'application/json',
            'access_token': acfun_params.access_token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'gzip, deflate, br',
            'idfa': acfun_params.idfa
        },
        body: ""
    }

    gabe.post(options, function (errors, response, body) {
        let data = JSON.parse(body);
        let msg = '';
        if (data.result !== 0) {
            if (data.error_msg) {
                msg = data.error_msg;
            } else {
                if (data.result === '105002') {
                    msg = '签到时间间隔太短，请稍后重试';
                } else {
                    msg = 'ACFUN签到失败，状态码：' + data.result;
                    console.log('ACFUN签到失败:' + body);
                }
            }
        } else {
            msg = data.msg;
        }
        gabe.notify('ACFUN签到', '', msg);
    });
}

signIn();
$done();