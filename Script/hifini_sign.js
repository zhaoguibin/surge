/*************************
 [Script]
 hifini签到.js = type=cron,cronexp=35 8 * * *,wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/Script/hifini_sign.js,script-update-interval=0

 获取hifini的cookie = type=http-request,pattern=https:\/\/www\.hifini\.com,tag=获取hifini的cookie,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/Script/hifini_sign.js,script-update-interval=0
 个人页面获取到cookie，https://www.hifini.com

 [MITM]
 hostname = *hifini.com*
 *************************/

const isRequest = typeof $request != "undefined"
if (isRequest) {
    let body = $request.body;
    const sign_reg = /var\ssign\s=\s"(.*)"/;
    sign = sign_reg.exec(body)[1];

    if (!sign) {
        $notification.post('HIFINI签到', '', '获取sign失败');
        $done({});
    }

    $persistentStore.write(sign, 'hifini_sign');

    if (!$persistentStore.read('hifini_sign')) {
        $notification.post('HIFINI签到', '', '保存sign失败');
        $done({});
    }
 $notification.post('HIFINI签到', '', sign);
 $done({});
}
