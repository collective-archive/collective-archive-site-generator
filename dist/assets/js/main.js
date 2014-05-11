var triggerBuild = function(callback) {
  $.get('http://collective-archive-deployer.herokuapp.com/deploy', function() {
    console.log('success');
    callback();
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
