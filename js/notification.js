var app = app || {};

(function() {
    var SEC = 1000;

    var Notification = app.Notification = function Notification(config) {
        this.config = config;
    };

    Notification.map = [];

    Notification.prototype.setup = function(result) {
        this.id = result.url;
        this.url = result.url;

        if (result.isSuccess) {
            this.icon = 'icon.png';
            this.priority = 0;
            this.autoCloseTime = this.config.successNotiSec * SEC;
        } else {
            this.icon = 'icon-failure.png';
            this.priority = 1;
            this.autoCloseTime = this.config.failureNotiSec * SEC;
        }

        this.opts = {
            type: 'basic',
            title: result.type + '! ' + result.project,
            eventTime: 100000,
            message: result.url,
            iconUrl: chrome.extension.getURL('img/' + this.icon),
            priority: this.priority,
            buttons: [
                {
                    title: 'show result',
                },
            ]
        };
    };

    Notification.prototype.show = function(result) {
        var self = this;

        this.setup(result);

        chrome.notifications.create(this.id, this.opts, function(id) {
            app.debug(id, 'create!!!!');

            Notification.map[self.id] = self;

            if (self.autoCloseTime > 0){
                setTimeout(function(){
                    self.clear();
                }, self.autoCloseTime);
            }
        });
    };

    Notification.prototype.clear = function() {
        chrome.notifications.clear(this.id, function() {});
        delete Notification.map[this.id];
    };

    chrome.notifications.onClicked.addListener(function(id) {
        app.debug('clicked!!!!!!!!!!!!!!!!!', id);
    });

    chrome.notifications.onButtonClicked.addListener(function(id) {
        window.open(Notification.map[id].url);
        app.debug('button clicked!!', id);
    });
})();

