var app = app || {};

(function() {
    var DEFAULT_AUTO_CLOSE_TIME = 1000 * 60 * 5;

    var successNotiSec = localStorage.success_noti_sec;

    var config = app.config = {
        jenkinsUrl: localStorage.jenkins_url,
        websocketUrl: localStorage.websocket_url,
        successNotiSec: successNotiSec === undefined ? DEFAULT_AUTO_CLOSE_TIME : successNotiSec,
        failureNotiSec: localStorage.failure_noti_sec,
        jobRegExp: localStorage.job_regexp,
    };

    if (!config.jenkinsUrl || !config.websocketUrl) {
        alert('set options!');
        return;
    }
})();

