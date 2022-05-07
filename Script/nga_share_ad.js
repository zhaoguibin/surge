/*************
 [Script]
nga分享帖子&&查看广告1 = type=cron,cronexp=5 8 * * *,wake-system=1,timeout=60,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/Script/nga_share_ad.js,script-update-interval=0

 获取nga的cookie = type=http-request,pattern= https:\/\/bbs\.nga\.cn,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/nga_share_ad.js,script-update-interval=0
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
function gabeX() { const get = (options, callback) => { $httpClient.get(options, (error, response, body) => { callback(error, response, body) }) }; const post = (options, callback) => { $httpClient.post(options, (error, response, body) => { callback(error, response, body) }) }; const write = (value, key) => { return $persistentStore.write(value, key) }; const read = (key) => { return $persistentStore.read(key) }; const notify = (title, subtitle, message) => { $notification.post(title, subtitle, message); $done() }; return { get, post, write, read, notify } }

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
        body_str += "------" + boundary + "\r\nContent-Disposition: form-data; name=\"" + index + "\"\r\n\r\n" + body[index] + "\r\n";
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

//每天分享帖子三次
const sharePost = function () {
    let share_options = {
        url: "https://ngabbs.com/nuke.php?__lib=data_query&__act=topic_share_log_v2",
        headers: {
            'Host': 'ngabbs.com',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 NGA_skull/7.1.8',
        },
        body: "__output=12&access_token=" + NGA_access_token + "&access_uid=" + NGA_access_uid + "&app_id=1001&event=2&tid=31470825"
    }

    return new Promise(function (resolve, reject) {
        gabe.post(share_options, function (errors, response, body) {
            resolve('nga分享帖子');
        });
    });
}

//分享帖子之后获取N币
const sharePostGetCoin = function () {
    let body = {
        __lib: "mission",
        __output: "11",
        app_id: "1001",
        __act: "check_mission",
        mid: "149",
        get_success_repeat: "1",
        no_compatible_fix: "1",
        access_uid: NGA_access_uid,
        access_token: NGA_access_token,
        __inchst: "UTF-8"
    };

    options.body = bodyData(body);

    return new Promise(function (resolve, reject) {
        gabe.post(options, function (errors, response, body) {
            let msg = '';
            let data = JSON.parse(body);
            if (data.data[0][2][149]) {
                msg = data.data[0][2][149];
            } else {
                msg = '分享帖子获取N币失败';
            }
            resolve(msg);
        });

    });
}

//看广告获取N币
const viewAdGetCoin = function () {
    let body = {
        __lib: "mission",
        __output: "11",
        app_id: "1001",
        __act: "video_view_task_counter_add_v2",
        get_success_repeat: "1",
        no_compatible_fix: "1",
        access_uid: NGA_access_uid,
        access_token: NGA_access_token,
        __inchst: "UTF-8"
    };

    options.body = bodyData(body);

    return new Promise(function (resolve, reject) {
        gabe.post(options, function (errors, response, body) {
            resolve('观看广告获取N币');
        });
    });
}

//分享帖子&&观看广告
async function sharePostAndViewAd() {
    //分享帖子
    const share_first = await sharePost();
    const share_second = await sharePost();
    const share_third = await sharePost();
    const share_get_coin = await sharePostGetCoin();
    //查看广告
    const view_ad_first = await viewAdGetCoin();
    const view_ad_second = await viewAdGetCoin();
    const view_ad_third = await viewAdGetCoin();
    const view_ad_fourth = await viewAdGetCoin();

    let msg = '第一次分享：' + share_first + "\r\n" + '第二次分享：' + share_second + "\r\n" + '第三次分享：' + share_third + "\r\n" + '分享结果：' + share_get_coin + "\r\n"
        + "第一次看广告：" + view_ad_first + "\r\n" + "第二次看广告：" + view_ad_second + "\r\n" + "第三次看广告：" + view_ad_third + "\r\n" + "第四次看广告：" + view_ad_fourth + "\r\n";
    gabe.notify('nga分享帖子&&观看广告', '', msg);
}

sharePostAndViewAd();

$done();
