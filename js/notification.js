var Notification = function(url, autoCloseTime) {
    this._url = 'chrome-extension://' + location.host + '/' + url;
    this._notifies = {};
    this._autoCloseTime = autoCloseTime || 0;
    this._windowCount = 0;
};

Notification.prototype = {
    open: function (item, autoCloseTime) {
        var self = this;
        var id = this._windowCount++;
        autoCloseTime = autoCloseTime || this._autoCloseTime;
        var notify = webkitNotifications.createHTMLNotification(this._url + "#" + id);
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
        self._notifies[id] = {'notify':notify, 'item':item};
        return id;
    },
    close: function (id) {
        var notifies = this._notifies;
        if (id != null) {
            var note = notifies[id];
            note.notify.cancel();
        } else {
            Object.keys(notifies).forEach(function(id){
                var note = notifies[id];
                note.notify.cancel();
            });
        }
    },
    getItem: function (id) {
        var notify = this._notifies[id];
        if (notify && notify.item) {
            return notify.item;
        }
        return null;
    }
};
