/*************************
 [Script]
 hifini签到.js = type=cron,cronexp=35 8 * * *,wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/Script/hifini_sign.js,script-update-interval=0

 获取hifini的cookie = type=http-request,pattern=https:\/\/www\.hifini\.com\/sg_sign\.htm,tag=获取hifini的cookie,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/Script/hifini_sign.js,script-update-interval=0
 个人页面获取到cookie，https://www.hifini.com

 [MITM]
 hostname = *hifini.com*
 *************************/

const isRequest = typeof $request != "undefined"
// if (isRequest) {
//     let body = $request.body;
//  $notification.post('HIFINI签到', '', body);
//  console.log(body);
//  rep_body = $response.body;
//  console.log(rep_body);
//  $done({});
// }

const isResponse = typeof $response != "undefined"
if(isResponse){
 rep_body = $response.body;
 console.log(rep_body);
 $done({});
}
