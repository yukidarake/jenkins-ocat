(function($) {
$(function() {
    var $inputs = $('.inputs');

    // restore
    $inputs.each(function() {
        var $this = $(this);
        $this.val(localStorage[$this.attr('name')] || '');
    });

    $('#save_button').on('click', function() {
        // save
        $inputs.each(function() {
            var $this = $(this);
            localStorage[$this.attr('name')] = $this.val();
        });

        chrome.extension.getBackgroundPage().window.location.reload();

        window.close();
    });

    var labels = {
        '#options_title': 'optionstitle',
        '#jenkins_url_label': 'jenkinsUrlLabel',
        '#websocket_url_label': 'websocketUrlLabel',
        '#success_noti_sec_label': 'successNotiSecLabel',
        '#failure_noti_sec_label': 'failureNotiSecLabel',
        '#job_regexp_label': 'jobRegexpLabel',
        '#save_button': 'saveButton',
    };

    for (var selector in labels) {
        $(selector).text(chrome.i18n.getMessage(labels[selector]));
    }});
})(jQuery);
