/*************************
 [Script]
 喝水小助手.js = type=cron,cronexp=0  9,10,11,12,13,14,15,16,17  mon,tue,wed,thu,fri,wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/drink_water_assistant.js
 *************************/

var myDate = new Date();
var time = new Array();
time[9] = 1;
time[10] = 2;
time[11] = 3;
time[12] = 4;
time[13] = 5;
time[14] = 6;
time[15] = 7;
time[16] = 8;
time[17] = 9;

var str = "这是今天第" + time[myDate.getHours()] + "轮提醒";

$notification.post('喝水小助手', myDate.toLocaleString(), str)
$done();