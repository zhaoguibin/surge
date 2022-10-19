



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

//毫秒时间戳
let times = Date.now();

let headers = {
    ':method': 'GET',
    ':scheme': 'https',
    ':authority': 'south-plus.net',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'accept-encoding': 'gzip, deflate, br',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) EdgiOS/105 Version/13.0.3 Safari/605.1.15',
    'accept-language': 'zh-CN,zh-Hans;q=0.9',
    'referer': 'https://south-plus.net/plugin.php?H_name-tasks.html',
    'cookie': cookie
};

//领取每日任务
const job = function () {
    let options = {
        url: "https://south-plus.net/plugin.php?H_name=tasks&action=ajax&actions=job&cid=15&nowtime=" + times + "&verify=" + verifyhash,
        headers: headers,
    }

    return new Promise(function (resolve, reject) {
        gabe.get(options, function (errors, response, body) {
            resolve(body);
        });
    });

}

//完成每日任务
const job2 = function () {
    let options = {
        url: "https://south-plus.net/plugin.php?H_name=tasks&action=ajax&actions=job2&cid=15&nowtime=" + times + "&verify=" + verifyhash,
        headers: headers,
    }

    return new Promise(function (resolve, reject) {
        gabe.get(options, function (errors, response, body) {
            resolve(body);
        });
    });
}

async function dailyTask() {
    const job_msg = await job();
    const job2_msg = await job2();

    let msg = '领取每日任务：' + job_msg + "\r\n" + '完成每日任务：' + job2_msg + "\r\n";
    gabe.notify('south-plus每日任务', '', msg);
}


dailyTask();

$done();