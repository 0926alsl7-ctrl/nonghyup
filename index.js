$(function() {
    // select 변경 이벤트
    $('select').on('change', function() {
        const val = $(this).val();
        if(val !== "Language" && val !== "Banking") {
            $(this).addClass('selected');
        } else {
            $(this).removeClass('selected');
        }
    });

    // 메뉴 호버 (mouseenter/mouseleave 대신 hover 사용)
    $('#navMenu > li').hover(
        function() {
            $(this).find('.depth2').stop().css({
                'visibility': 'visible',
                'opacity': '1',
                'transform': 'translateY(0)'
            });
            $('.nav-wrap').stop().fadeIn(200);
        },
        function() {
            $(this).find('.depth2').stop().css({
                'visibility': 'hidden',
                'opacity': '0',
                'transform': 'translateY(20px)'
            });
            $('.nav-wrap').stop().fadeOut(200);
        }
    );
});
var swiper = new Swiper(".news-swiper", {
    loop: true,
    autoplay: { delay: 5000 },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});