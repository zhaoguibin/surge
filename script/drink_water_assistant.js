/*************************
 [Script]
 喝水小助手.js = type=cron,cronexp=* * 9-17 * * 1-5,wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/RNB_daily_bonus.js
 *************************/

var Date = new Date();

$notification.post('喝水小助手', Date.toLocaleString(), '喝水喽')
$done();