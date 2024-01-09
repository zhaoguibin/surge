/*************
 [Script]
 south-plus任务 = type=cron,cronexp=12 8 * * *,wake-system=1,timeout=60,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/Script/south-plus-task.js,script-update-interval=0

 获取cookie
 south-plus-cookie = type=http-response,pattern=https:\/\/south\-plus\.net\/u\.php,requires-body=1,max-size=0,debug=0,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/Script/south-plus-task.js
 手机浏览器登录https://south-plus.net之后到【https://south-plus.net/u.php】获取cookie

 [MITM]
 hostname = south-plus.net
 **************/

const isRequest = typeof $request != "undefined"
if (isRequest) {
    let cookie = $request.headers.Cookie;
    if (!cookie) {
        $notification.post('', '', '获取[south-plus]cookie失败');
        $done();
    }

    let body = $response.body;
    const verifyhash_regex = /verifyhash = '(\w+)';/gm;
    const verifyhash = verifyhash_regex.exec(body);

    if (!verifyhash[1]) {
        $notification.post('', '', '获取[south-plus]verifyhash失败');
        $done();
    }

    $persistentStore.write(cookie, 'south_plus_cookie');
    if (!$persistentStore.read('south_plus_cookie')) {
        $notification.post('', '', '保存【south_plus_cookie】失败');
        $done();
    }

    $persistentStore.write(verifyhash[1], 'south_plus_verifyhash');
    if (!$persistentStore.read('south_plus_verifyhash')) {
        $notification.post('', '', '保存【south_plus_verifyhash】失败');
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
    };
    const post = (options, callback) => {
        $httpClient.post(options, (error, response, body) => {
            callback(error, response, body)
        })
    };
    const write = (value, key) => {
        return $persistentStore.write(value, key)
    };
    const read = (key) => {
        return $persistentStore.read(key)
    };
    const notify = (title, subtitle, message) => {
        $notification.post(title, subtitle, message);
        $done()
    };
    return {get, post, write, read, notify}
}

let gabe = gabeX();

const cookie = $persistentStore.read('south_plus_cookie');
if (!cookie) {
    gabe.notify('', '', '读取【cookie】失败，请手机浏览器登录【https://south-plus.net/u.php】获取');
}

const verifyhash = $persistentStore.read('south_plus_verifyhash');
if (!verifyhash) {
    gabe.notify('', '', '读取【south_plus_verifyhash】失败，请手机浏览器登录【https://south-plus.net/u.php】获取');
}


let headers = {
    'host': 'south-plus.net',
    'Sec-Fetch-Site': 'same-origin',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cookie': cookie,
    'Sec-Fetch-Mode': 'navigate',
    'Accept': "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    'User-Agent': "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
    'Referer': "https://south-plus.net/plugin.php?H_name-tasks.html",
    "Sec-Fetch-Dest": 'iframe',
    "Accept-Language": "zh-CN,zh-Hans;q=0.9"
};

//毫秒时间戳
const times = Date.now();
const week = new Date().getDay();
const week_cid = 14;//每周任务标识
const daily_cid = 15;//每日任务标识
const base_url = "https://south-plus.net/plugin.php?H_name=tasks&action=ajax&nowtime=" + times + "&verify=" + verifyhash;

function getMsg(body) {
    let msg_regex = /<!\[CDATA\[(.*)\]\]>/gm;
    return msg_regex.exec(body)[1];
}

//领取每日任务
const dailyJob = function () {
    let options = {
        url: base_url + "&actions=job&cid=" + daily_cid, headers: headers,
    }

    return new Promise(function (resolve, reject) {
        gabe.get(options, function (errors, response, body) {
            console.log('领取每日任务' + body);
            resolve(getMsg(body));
        });
    });

}

//完成每日任务
const dailyJob2 = function () {
    let options = {
        url: base_url + "&actions=job2&cid=" + daily_cid, headers: headers,
    }

    return new Promise(function (resolve, reject) {
        gabe.get(options, function (errors, response, body) {
            console.log('完成每日任务' + body);
            resolve(getMsg(body));
        });
    });
}

//领取每周任务
const weekJob = function () {
    let options = {
        url: base_url + "&actions=job&cid=" + week_cid, headers: headers,
    }

    if (week !== 1) {
        return new Promise(function (resolve, reject) {
            resolve('不是周一，不用做每周任务');
        });
    }

    return new Promise(function (resolve, reject) {
        gabe.get(options, function (errors, response, body) {
            console.log('领取每周任务' + body);
            resolve(getMsg(body));
        });
    });

}

//完成每周任务
const weekJob2 = function () {
    let options = {
        url: base_url + "&actions=job2&cid=" + week_cid, headers: headers,
    }

    if (week !== 1) {
        return new Promise(function (resolve, reject) {
            resolve('不是周一，不用做每周任务');
        });
    }

    return new Promise(function (resolve, reject) {
        gabe.get(options, function (errors, response, body) {
            console.log('完成每周任务' + body);
            resolve(getMsg(body));
        });
    });
}

async function dailyTask() {
    const daily_job_msg = await dailyJob();
    const daily_job2_msg = await dailyJob2();
    const week_job_msg = await weekJob();
    const week_job2_msg = await weekJob2();

    let msg = '领取每日任务：' + daily_job_msg + "\r\n" + '完成每日任务：' + daily_job2_msg + "\r\n" + '领取每周任务：' + week_job_msg + "\r\n" + '完成每周任务：' + week_job2_msg;
    gabe.notify('south-plus每日任务', '', msg);
}


dailyTask();

$done();
