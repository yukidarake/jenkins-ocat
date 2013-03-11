var notification = new Notification('html/notification.html', 1000 * 60 * 5);

function createWs() {
    var jenkinsUrl = localStorage.jenkins_url;
    var websocketUrl = localStorage.websocket_url;
    var successNotiSec = localStorage.success_noti_sec;
    var failureNotiSec = localStorage.websocket_url;
    var jobRegexp = localStorage.job_regexp;

    if (!jenkinsUrl || !websocketUrl) {
        alert('設定画面でURLを指定してください！');
        return;
    }

    var ws = new WebSocket(websocketUrl);

    ws.onmessage = function(message) {
        try {
            var job = JSON.parse(message.data);

            var ctx = {
                url: jenkinsUrl + '/job/'
                   + job.project + '/' + job.number + '/',
                project: job.project,
                time: new Date(message.timeStamp + 1000 * 60 * 60 * 9)
                        .toISOString().replace('T', ' ').replace(/\..+$/, ''),
            };

			if (!job.project.match(jobRegexp)) {
				return;
			}
            if (job.result !== 'SUCCESS') {
                ctx.ok = false;
                ctx.message = 'NG';
				if (successNotiSec) {
                	notification.open(ctx, 1000 * successNotiSec);
				} else {
                	notification.open(ctx);
				}
            } else {
                ctx.ok = true;
                ctx.message = 'OK';
    			if (failureNotiSec) {
                	notification.open(ctx, 1000 * failureNotiSec);
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

    ws.onclose = function() {
        console.log('reconnect!');
        setTimeout(function() {
            ws = createWs();
        }, 30000);
    };

    return ws;
}

var ws = createWs();

// notification.html
chrome.extension.onRequest.addListener(function(message, sender, sendResponse){
    sendResponse(notification.getItem(message.id));
});

