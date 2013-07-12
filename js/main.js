(function() {
    var DEFAULT_AUTO_CLOSE_TIME = 1000 * 60 * 5;
    var CHECK_INTERVAL = 60000;
    var notification = new Notification({
        autoCloseTime: DEFAULT_AUTO_CLOSE_TIME
    });
    var lastCheckedAt = Date.now();
    var ws;

    function connect() {
        var jenkinsUrl = localStorage.jenkins_url;
        var websocketUrl = localStorage.websocket_url;
        var successNotiSec = localStorage.success_noti_sec;
        var failureNotiSec = localStorage.websocket_url;
        var jobRegExp = localStorage.job_regexp;

        if (!jenkinsUrl || !websocketUrl) {
            alert('設定画面でURLを指定してください！');
            return;
        }

        try {
            ws && ws.close();
        } catch(e) {
            console.log(e);
        }

        ws = new WebSocket(websocketUrl);

        ws.onmessage = function(message) {
            try {
                var job = JSON.parse(message.data);
                var ctx = {
                    url: jenkinsUrl + '/job/'
                    + job.project + '/' + job.number + '/',
                    project: job.project,
                    isDev:  job.project.indexOf('dev.') >= 0,
                    time: new Date(message.timeStamp + 1000 * 60 * 60 * 9)
                            .toISOString().replace('T', ' ').replace(/\..+$/, ''),
                };

                if (jobRegExp && !(new RegExp(jobRegExp).test(job.project))) {
                    return;
                }

                if (job.result !== 'SUCCESS') {
                    ctx.ok = false;
                    ctx.message = 'NG';
                    if (failureNotiSec) {
                        notification.open(ctx, 1000 * failureNotiSec);
                    } else {
                        notification.open(ctx);
                    }
                } else {
                    ctx.ok = true;
                    ctx.message = 'OK';

                    if (successNotiSec) {
                        notification.open(ctx, 1000 * successNotiSec);
                    } else {
                        notification.open(ctx);
                    }
                }
            } catch(e) {
                alert(e);
            }
        };

        ws.onerror = function(err) {
            console.log(err);
        };

        ws.onclose = function(err) {
            console.log('close!');
        };
    }

    connect();

    //現在時刻と前回の時刻を1分毎に比較して、15秒以上秒以上差があったら再接続する。
    (function check() {
        setTimeout(function(){
            var now = Date.now();
            if ((now - lastCheckedAt) > (CHECK_INTERVAL + 15000)){
                console.log('reconnect!');
                connect();// 再接続
            }
            lastCheckedAt = now;
            check();
        }, CHECK_INTERVAL);
    })();

    // notification.html
    chrome.extension.onRequest.addListener(function(message, sender, sendResponse){
        sendResponse(notification.getItem(message.id));
    });
})();

