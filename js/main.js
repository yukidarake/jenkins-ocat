var notification = new Notification('html/notification.html', 1000 * 60 * 5);
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

        try {
           ws.close();
        } catch(e) {
            ws = connect();
        }
    };

    ws.onopen = function() {
        (function heartbeat() {
            setTimeout(function() {
                ws.send('');
                console.log('heartbeat');
                heartbeat();
            }, 30000);
        })();
    };

    ws.onclose = function() {
        console.log('reconnect!');
        setTimeout(function() {
            ws = connect();
        }, 30000);
    };
}

connect();

//現在時刻と前回の時刻を1分毎に比較して、15秒以上秒以上差があったら再接続する。
(function check() {
    var reload = 60000;
    var before = new Date();
    setTimeout(function(){
        var current = new Date();
        if((current - before) > (reload + 15000)){
            connect();// 再接続
        }
        before = current;
        check();
    }, reload);
})();

// notification.html
chrome.extension.onRequest.addListener(function(message, sender, sendResponse){
    sendResponse(notification.getItem(message.id));
});

