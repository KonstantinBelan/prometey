var swiper = new Swiper('.team__wrapper', {
  slidesPerView: 3,
  spaceBetween: 30,
  scrollbar: {
    el: '.team__wrapper .swiper-scrollbar',
    hide: false,
    draggable: true,
  },
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    970: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
})
