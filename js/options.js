(function($) {
$(function() {
    var $inputs = $('.inputs');

    // restore
    $inputs.each(function() {
        var $this = $(this);
        $this.val(localStorage[$this.attr('name')] || '');
    });

    $('#save').on('click', function() {
        // save
        $inputs.each(function() {
            var $this = $(this);
            localStorage[$this.attr('name')] = $this.val();
        });

        chrome.extension.getBackgroundPage().window.location.reload();

        window.close();
    });
});
})(jQuery);
