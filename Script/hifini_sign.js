/*************************
 [Script]
 hifini签到.js = type=cron,cronexp=35 8 * * *,wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/Script/hifini_sign.js,script-update-interval=0

 获取hifini的cookie&&sign = type=http-response,pattern=https:\/\/www\.hifini\.com\/sg_sign\.htm,tag=获取hifini的sign,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/Script/hifini_sign.js,requires-body=1,max-size=0,debug=0
 个人页面获取到cookie，https://www.hifini.com/sg_sign.htm

 [MITM]
 hostname = *hifini.com*
 *************************/

const isRequest = typeof $request != "undefined"
if (isRequest) {
    let headers = $request.headers;
 console.log(headers);
    $done({});
}
