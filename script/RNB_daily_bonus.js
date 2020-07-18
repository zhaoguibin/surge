/*************************
[Script]
mixrnb签到.js = type=cron,cronexp=35 8 * * *,wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/RNB_daily_bonus.js
*************************/

//cookie
const R5nb_c8f5_auth = 'R5nb_c8f5_auth=4b1bsKzK7EbW%2Fmoaa6yWrqYiPNNBnBoL7aPZI8gEOohExVsK4zId05V9riHZd3S3k12PtTDW8SBUO7r%2FTITGi7NA7w';
const saltkey = 'R5nb_c8f5_saltkey=iJFyCpfe';

var error, response, body;
var set_cookies = new Array();

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
};

var $gabeX = gabeX();

var options = {
  url: "http://www.mixrnb.com/plugin.php?id=dsu_paulsign:sign",
  headers: {
    'Cookie': R5nb_c8f5_auth + ';' + saltkey,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36 Edg/83.0.478.64',
  },
  body: {
  }
}

function getSecuritySessionVerify(error, response, body) {
  set_cookie = response['headers']['Set-Cookie'];
  set_cookies = set_cookie.split(";"); //字符分割

  if (!set_cookies) {
    $gabeX.notify('', '', '获取SecuritySessionVerify失败');
  }

  options.headers.Cookie += ';' + set_cookies[0];
  options.url += '&security_verify_data=313932302c31303830';
}


function getSecuritySessionMidVerify(error, response, body) {
  set_cookie = response['headers']['Set-Cookie'];
  set_cookies = set_cookie.split(";"); //字符分割

  if (!set_cookies) {
    $gabeX.notify('', '', '获取SecuritySessionMidVerify失败');
  }

  options.headers.Cookie += ';' + set_cookies[0];
}

function getFormHash(error, response, body) {
  const regex = /^<li><a\shref=\"member\.php\?mod=logging&amp;action=logout&amp;formhash=(\w*)\">.*<\/a><\/li>$/gmi;
  const formhash = regex.exec(body)[1];
  if (!formhash) {
    $gabeX.notify('', '', '获取formhash失败');
  }
  options.url = 'http://www.mixrnb.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1';
  options.body = 'formhash=' + formhash + '&qdxq=kx'
  options['headers']['Content-Type'] = 'application/x-www-form-urlencoded'

}

function decodeXml(error, response, body) {
  // $gabeX.notify('', '', JSON.stringify(body));
  $gabeX.notify('', '', $response.body(body));
}

$gabeX.get(options, getSecuritySessionVerify);

setTimeout(function () {
  $gabeX.get(options, getSecuritySessionMidVerify);
}, 1000);

setTimeout(function () {
  $gabeX.get(options, getFormHash);
}, 2000);


setTimeout(function () {
  $gabeX.post(options, decodeXml);
}, 3500);


$done();