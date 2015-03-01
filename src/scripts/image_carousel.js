window.CA = window.CA || {};

CA.ImageCarousel = function() {
  return {
    init: function() {
      $('#image-carousel').carousel({
        interval: false,
        keyboard: true
      });
    }
  }
}();
