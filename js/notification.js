function Notification(opts) {
    opts = opts || {};

    var self = this;
    this._notifies = {};
    this._autoCloseTime = opts.autoCloseTime || 0;
    this._windowCount = 0;

    var isHTMLNotification = webkitNotifications.createHTMLNotification;
    if (isHTMLNotification) {
        this._url = chrome.extension.getURL('html/notification.html');
        this.createNotification = function(id, item) {
            return webkitNotifications.createHTMLNotification(self._url + "#" + id);
        };
    } else {
        this.createNotification = function(id, item) {
            var icon = item.ok ? 'icon.png' : 'icon-failure.png';
            console.log(chrome.extension.getURL('img/' + icon));
            return webkitNotifications.createNotification(
                chrome.extension.getURL('img/' + icon),
                item.message + '! ' + item.project,
                item.url
            );
        };
    }
}

Notification.prototype.open = function(item, autoCloseTime) {
    var self = this;
    var id = this._windowCount++;
    autoCloseTime = autoCloseTime || this._autoCloseTime;
    var notify = this.createNotification(id, item);
    notify.ondisplay = function(){
        if (autoCloseTime > 0){
            setTimeout(function(){
                notify.cancel();
            }, autoCloseTime);
        }
    };
    notify.onclose = function(){
        delete self._notifies[id];
    };
    notify.show();
    self._notifies[id] = {
        notify: notify,
        item: item,
    };
    return id;
};

Notification.prototype.close = function(id) {
    var self = this;
    if (id >= 0) {
        self._notifies[id].notify.cancel();
    } else {
        Object.keys(this._notifies).forEach(function(id){
            self._notifies[id].notify.cancel();
        });
    }
};

Notification.prototype.getItem = function(id) {
    var notify = this._notifies[id];
    if (notify && notify.item) {
        return notify.item;
    }
    return null;
};

