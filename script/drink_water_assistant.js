/*************************
 [Script]
 喝水小助手.js = type=cron,cronexp=0 0 9-17 ? * MON-FRI,wake-system=1,script-path=https://raw.githubusercontent.com/zhaoguibin/surge/master/script/drink_water_assistant.js
 *************************/

var myDate = new Date();
var time = new Array();
time[9] = 1;
time[10] = 2;
time[11] = 3;
time[13] = 4;
time[14] = 5;
time[15] = 6;
time[16] = 7;
time[17] = 8;

if(time[myDate.getHours()]){
    var str = "这是今天第" + time[myDate.getHours()] + "轮提醒";
    $notification.post('喝水小助手', myDate.toLocaleString(), str)
}

$done();