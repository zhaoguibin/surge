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
    body: "------WebKitFormBoundaryAgjAve4UZAXpjupu\r\nContent-Disposition: form-data; name=\"__lib\"\r\n\r\ncheck_in\r\n------WebKitFormBoundaryAgjAve4UZAXpjupu\r\nContent-Disposition: form-data; name=\"__output\"\r\n\r\n11\r\n------WebKitFormBoundaryAgjAve4UZAXpjupu\r\nContent-Disposition: form-data; name=\"app_id\"\r\n\r\n1001\r\n------WebKitFormBoundaryAgjAve4UZAXpjupu\r\nContent-Disposition: form-data; name=\"device\"\r\n\r\niOS;aef8689c8c5df6b42f4b500bfdd72cfacee0e8e27e05c0fb8b95681f816d66aa\r\n------WebKitFormBoundaryAgjAve4UZAXpjupu\r\nContent-Disposition: form-data; name=\"__act\"\r\n\r\ncheck_in\r\n------WebKitFormBoundaryAgjAve4UZAXpjupu\r\nContent-Disposition: form-data; name=\"access_uid\"\r\n\r\n60082372\r\n------WebKitFormBoundaryAgjAve4UZAXpjupu\r\nContent-Disposition: form-data; name=\"access_token\"\r\n\r\nX8mvmakltq9ms97u99s4i28vmvvr2s8uil8ll957\r\n------WebKitFormBoundaryAgjAve4UZAXpjupu\r\nContent-Disposition: form-data; name=\"__ngaClientChecksum\"\r\n\r\n920c72fe416351cb6bd6adb05dd43d501614300728\r\n------WebKitFormBoundaryAgjAve4UZAXpjupu\r\nContent-Disposition: form-data; name=\"__inchst\"\r\n\r\nUTF-8\r\n------WebKitFormBoundaryAgjAve4UZAXpjupu--\r\n\r\n"
}


$gabeX.post(options, decodeJson);

function decodeJson(errors, response, body) {
    let data = JSON.parse(body);
    let msg = '';

    if(data.data){
        msg = data.data[0];
    }else if(data.error){
        msg = data.error[0];
    }else{
        msg = data;
    }

    $gabeX.notify('nga签到','',msg);
    console.log(body);
}


$done();