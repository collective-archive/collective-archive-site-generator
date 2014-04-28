var triggerBuild = function(callback) {
  $.get('http://collective-archive-deployer.herokuapp.com/deploy', {
      success: function() {
        console.log('success');
        callback();
      },
      error: function() {
        console.log('error');
      }
  });
}

$(function() {
  $('.reload-content').click(function(e) {
    $button = $(this);

    triggerBuild(function() {
      $('footer').html('<p>The site will be rebuilt shortly.</p>');
    });

    e.preventDefault();
    return false;
  });
});
