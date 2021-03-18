/*************
 [Script]
 NGA签到.js = type=cron,cronexp=35 8 * * *,wake-system=1,timeout=60,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/nga_daily_bonus.js

 获取nga的cookie = type=http-request,pattern= https:\/\/bbs\.nga\.cn,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/nga_daily_bonus.js,script-update-interval=0
 手机浏览器登录nga之后到【https://bbs.nga.cn】获取cookie

 [MITM]
 hostname = bbs.nga.cn
 **************/
const isRequest = typeof $request != "undefined"
if (isRequest) {
    let cookie = $request.headers.Cookie;
    if (!cookie) {
        $notification.post('', '', '获取NGA_cookie失败');
        $done();
    }

    let access_uid;
    let access_token;

    const access_token_reg = /ngaPassportCid=([\w\s\d]*)/;
    access_token = access_token_reg.exec(cookie)[1];

    if (!access_token) {
        $notification.post('', '', '获取access_token失败');
        $done();
    }

    const access_uid_reg = /ngaPassportUid=([\w\s\d]*)/;
    access_uid = access_uid_reg.exec(cookie)[1];

    if (!access_uid) {
        $notification.post('', '', '获取access_uid失败');
        $done();
    }

    $persistentStore.write(access_uid, 'NGA_access_uid');
    if (!$persistentStore.read('NGA_access_uid')) {
        $notification.post('', '', '保存NGA_access_uid失败');
        $done();
    }

    $persistentStore.write(access_token, 'NGA_access_token');
    if (!$persistentStore.read('NGA_access_token')) {
        $notification.post('', '', '保存NGA_access_token失败');
        $done();
    }

    $notification.post('', '', '获取cookie成功，请禁用此脚本');
    $done();
}


// Modified from yichahucha
function gabeX(){const get=(options,callback)=>{$httpClient.get(options,(error,response,body)=>{callback(error,response,body)})};const post=(options,callback)=>{$httpClient.post(options,(error,response,body)=>{callback(error,response,body)})};const write=(value,key)=>{return $persistentStore.write(value,key)};const read=(key)=>{return $persistentStore.read(key)};const notify=(title,subtitle,message)=>{$notification.post(title,subtitle,message);$done()};return{get,post,write,read,notify}}

let gabe = gabeX();

const NGA_access_uid = $persistentStore.read('NGA_access_uid');
if (!NGA_access_uid) {
    gabe.notify('', '', '读取NGA_access_uid失败，请手机浏览器登录https://bbs.nga.cn获取');
}

const NGA_access_token = $persistentStore.read('NGA_access_token');
if (!NGA_access_token) {
    gabe.notify('', '', '读取NGA_access_token失败，请手机浏览器登录https://bbs.nga.cn获取');
}

let boundary = "WebKitFormBoundaryAgjAve4UZAXpjupu";

function bodyData(body) {
    let body_str = '';
    let index;

    for (index in body) {
        body_str += "------"+boundary + "\r\nContent-Disposition: form-data; name=\"" + index + "\"\r\n\r\n" + body[index] + "\r\n";
    }
    return body_str;
}

let options = {
    url: "https://ngabbs.com/nuke.php",
    headers: {
        'Host': 'ngabbs.com',
        'Content-Type': 'multipart/form-data; boundary=----' + boundary,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 NGA_skull/7.1.8',
    },
    body: ""
}

//刮墙
function checkIn() {
    let body = {
        __lib: "check_in",
        __output: "11",
        app_id: "1001",
        __act: "check_in",
        access_uid: NGA_access_uid,
        access_token: NGA_access_token
    };

    options.body = bodyData(body);
    gabe.post(options, decodeJson);
}

//每日签到得银币
function dailySilverCoins() {
    let body = {
        __lib: "mission",
        __output: "11",
        app_id: "1001",
        __act: "checkin_count_add",
        access_uid: NGA_access_uid,
        access_token: NGA_access_token,
        no_compatible_fix: 1,
        mid: 2
    };

    options.body = bodyData(body);
    gabe.post(options, function (errors, response, body) {
        console.log(JSON.parse(body))
    });
}

//每日签到得N币
function dailyNCoins() {
    let body = {
        __lib: "mission",
        __output: "11",
        app_id: "1001",
        __act: "checkin_count_add",
        access_uid: NGA_access_uid,
        access_token: NGA_access_token,
        no_compatible_fix: 1,
        mid: 30
    };
    options.body = bodyData(body);

    gabe.post(options, function (errors, response, body) {
        console.log(JSON.parse(body))
    });
}

//累计签到365天
function addUpDailyBonus() {
    let body = {
        __lib: "mission",
        __output: "11",
        app_id: "1001",
        __act: "checkin_count_add",
        access_uid: NGA_access_uid,
        access_token: NGA_access_token,
        no_compatible_fix: 1,
        mid: 131
    };
    options.body = bodyData(body);

    gabe.post(options, function (errors, response, body) {
        console.log(JSON.parse(body))
    });
}

//解析消息
function decodeJson(errors, response, body) {
    let data = JSON.parse(body);
    let msg = '';

    if (data.data) {
        msg = data.data[0];
    } else if (data.error) {
        msg = data.error[0];
    } else {
        msg = data;
    }

    gabe.notify('nga签到', '', msg);
    console.log(body);

    dailySilverCoins();
    dailyNCoins();
    addUpDailyBonus();
}

checkIn();

$done();