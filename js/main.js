var app = app || {};

(function() {
    if (!chrome.notifications) {
        alert('this version is not supported!');
        return;
    }

    var CHECK_INTERVAL = 60000;
    var lastCheckedAt = Date.now();
    var ws;

    function connect() {
        var config = app.config;

        try {
            ws && ws.close();
        } catch(e) {
            app.debug(e);
        }

        ws = new WebSocket(config.websocketUrl);

        ws.onmessage = function(message) {
            var result = new app.Result(app.config);

            result.parse(message);

            if (!result.isTarget()) {
                return;
            }

            new app.Notification(app.config).show(result);
        };

        ws.onerror = function(err) {
            app.debug(err);
        };

        ws.onclose = function(err) {
            app.debug('close!');
        };
    }

    connect();

    //現在時刻と前回の時刻を1分毎に比較して、15秒以上秒以上差があったら再接続する。
    (function check() {
        setTimeout(function(){
            var now = Date.now();
            if ((now - lastCheckedAt) > (CHECK_INTERVAL + 15000)){
                app.debug('reconnect!');
                connect();// 再接続
            }
            lastCheckedAt = now;
            check();
        }, CHECK_INTERVAL);
    })();
})();

