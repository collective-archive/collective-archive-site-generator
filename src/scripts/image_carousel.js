window.ImageCarousel = function() {
  return {
    init: function() {
      $('.image-carousel').slick({
        arrows: true,
        dots: true,
        prevArrow: '.image-carousel-prev',
        nextArrow: '.image-carousel-next',
        onInit: function(slider) {
          if(slider.slideCount > 1) {
            $('.image-carousel-button').show();
          }

          $('.image-carousel img').show();
        }
      });
    }
  }
}();
