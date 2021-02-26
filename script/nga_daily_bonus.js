/*************************
 [Script]
 mixrnb签到.js = type=cron,cronexp=35 8 * * *,wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/RNB_daily_bonus.js

 获取mixrnb的cookie = type=http-request,pattern=http:\/\/www.mixrnb.com\/plugin\.php\?id=dsu_paulsign:sign,tag=获取mixrnb的cookie,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/RNB_daily_bonus.js,script-update-interval=0
 签到页面获取到cookie，http://www.mixrnb.com/plugin.php?id=dsu_paulsign:sign
 *************************/

// const isRequest = typeof $request != "undefined"
// if (isRequest) {
//     $cookie = $request.headers.Cookie;
//
//     const saltkey_regex = /(R5nb_c8f5_saltkey=\S*)/gm;
//     const auth_regex = /(R5nb_c8f5_auth=(\S*));/gm;
//     const R5nb_c8f5_saltkey = saltkey_regex.exec($cookie);
//     const R5nb_c8f5_auth = auth_regex.exec($cookie);
//
//     if (!R5nb_c8f5_saltkey) {
//         $notification.post('', '', '获取R5nb_c8f5_saltkey失败');
//         $done();
//     }
//
//     if (!R5nb_c8f5_auth) {
//         $notification.post('', '', '获取R5nb_c8f5_auth失败');
//         $done();
//     }
//
//     $persistentStore.write(R5nb_c8f5_saltkey[1], 'R5nb_c8f5_saltkey');
//
//     if (!$persistentStore.read('R5nb_c8f5_saltkey')) {
//         $notification.post('', '', '保存R5nb_c8f5_saltkey失败');
//         $done();
//     }
//
//     $persistentStore.write(R5nb_c8f5_auth[1], 'R5nb_c8f5_auth');
//
//     if (!$persistentStore.read('R5nb_c8f5_auth')) {
//         $notification.post('', '', '保存R5nb_c8f5_auth失败');
//         $done();
//     }
//
//     $notification.post('', '', '获取cookie成功，请禁用此脚本');
//     $done();
// }

// Modified from yichahucha
function gabeX() {
    const get = (options, callback) => {
        $httpClient.get(options, (error, response, body) => {
            callback(error, response, body)
        })
    }

    const post = (options, callback) => {
        $httpClient.post(options, (error, response, body) => {
            callback(error, response, body)
        })
    }

    const write = (value, key) => {
        return $persistentStore.write(value, key)
    }

    const read = (key) => {
        return $persistentStore.read(key)
    }

    const notify = (title, subtitle, message) => {
        $notification.post(title, subtitle, message)
        $done();
    }

    return {
        get,
        post,
        write,
        read,
        notify
    }
}

var $gabeX = gabeX();

//cookie
// const R5nb_c8f5_auth = $persistentStore.read('R5nb_c8f5_auth');
// const saltkey = $persistentStore.read('R5nb_c8f5_saltkey');
//
// if (!saltkey) {
//     $gabeX.notify('', '', '读取R5nb_c8f5_saltkey失败，请先访问个人空间【http://www.mixrnb.com/space-uid-*.html】获取');
// }
//
// if (!R5nb_c8f5_auth) {
//     $gabeX.notify('', '', '读取R5nb_c8f5_auth失败，请先访问个人空间【http://www.mixrnb.com/space-uid-*.html】获取');
// }

var options = {
    url: "https://ngabbs.com/nuke.php",
    headers: {
        'Host':'ngabbs.com',
        'Content-Type':'multipart/form-data; boundary=----WebKitFormBoundaryAgjAve4UZAXpjupu',
        'Origin':'https://ngabbs.com',
        'Accept-Encoding':'gzip, deflate, br',
        'Cookie':'ngacn0comInfoCheckTime=1614300695; ngacn0comUserInfo=6LW15qGC5b2s%096LW15qGC5b2s%0939%0939%09%0910%091000%094%090%090%0961_8; ngacn0comUserInfoCheck=3d0f2586d6a3d441ab9f991ed691787d',
        'Connection':'keep-alive',
        'Accept':'*/*',
        'User-Agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 NGA_skull/7.1.8',
        'Referer':'https://ngabbs.com/misc/mission/mission.php',
        'Content-Length':'1091',
        'Accept-Language':'zh-cn'
    },
    body: {
        '__lib':'check_in',
        '__output':'11',
        'app_id':'1001',
        'device':'iOS;aef8689c8c5df6b42f4b500bfdd72cfacee0e8e27e05c0fb8b95681f816d66aa',
        '__act':'check_in',
        'access_uid':'60082372',
        'access_token':'X8mvmakltq9ms97u99s4i28vmvvr2s8uil8ll957',
        '__ngaClientChecksum':'920c72fe416351cb6bd6adb05dd43d501614300728',
        '__inchst':'UTF-8',
    }
}


$gabeX.post(options, decodeXml);

function decodeXml(error, response, body) {
    console.log(body);
}


$done();