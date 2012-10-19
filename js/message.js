chrome.extension.sendRequest({id:location.hash.slice(1)}, function(message){
  try {
    $('#title').text(message.project);
    $('#time').text(message.time);

    var $body = $('body');

    if (message.ok) {
      $body.removeClass('failure');
    } else {
      $body.addClass('failure');
      if (message.isDev) {
        $body.addClass('dev');
      } else {
        $body.removeClass('dev');
      }
    }

    $('#message').text(message.message);
    $('#jenkins_url').attr('href', message.url);
  } catch(e) {
    alert(e);
  }
});

