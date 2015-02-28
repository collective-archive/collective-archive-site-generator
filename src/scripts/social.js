window.CA = window.CA || {};

CA.SocialMedia = function() {
  return {
    init: function() {
      $('.social-twitter').data('via', document.URL);
      $('.social-facebook').attr('href', "http://www.facebook.com/sharer/sharer.php?s=100&amp;p[url]=" + document.URL);
      $('.social-pinterest').attr('href', "http://pinterest.com/pin/create/button/?url=" + document.URL + "&media=" + $('.fancybox img').attr('src'))
    }
  };
}();
