// scroll events 초기화 ==================================
AOS.init({
    duration: 2000, 
    once: false,
    easing: 'ease-in-out' 
});
// header ==============================================
$(function() {
    $('.lang, .banking').on('click', function(e) {
        $(this).toggleClass('on').siblings().removeClass('on');
        e.stopPropagation(); 
    });

    $(document).on('click', function() {
        $('.lang, .banking').removeClass('on');
    });
});

$(function() {
    $('select').on('change', function() {
        const val = $(this).val();
        if(val !== "Language" && val !== "Banking") {
            $(this).addClass('selected');
        } else {
            $(this).removeClass('selected');
        }
    });
    

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
// section news 스와이퍼 =================================================
var newsSwiper = new Swiper(".news-swiper", {
    loop: true,
    speed: 800,
    autoplay: {
        delay: 7000, 
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    on: {
        init: function() { document.querySelector('.swiper-pagination-bullet-active').classList.add('on'); },
        slideChange: function() {
            document.querySelectorAll('.swiper-pagination-bullet').forEach(function(b) { b.classList.remove('on'); });
        },
        slideChangeTransitionEnd: function() {
            setTimeout(function() {
                var activeBullet = document.querySelector('.swiper-pagination-bullet-active');
                if(activeBullet) activeBullet.classList.add('on');
            }, 50);
        }
    }
});

// footer - 패밀리 사이트 토글  ==================================
function toggleFamily() {
    const wrap = document.querySelector('.family-wrap');
    wrap.classList.toggle('active');
}

window.addEventListener('click', (e) => {
    const wrap = document.querySelector('.family-wrap');
    if (!wrap.contains(e.target)) {
        wrap.classList.remove('active');
    }
});

// floating  ==================================
const scrollBtn = document.getElementById('scrollBtn');

window.addEventListener('scroll', () => {
    let scrollHeight = document.documentElement.scrollHeight;
    let scrollTop = document.documentElement.scrollTop;
    let clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
        scrollBtn.classList.add('is-bottom');
    } else {
        scrollBtn.classList.remove('is-bottom');
    }
});

scrollBtn.addEventListener('click', () => {
    if (scrollBtn.classList.contains('is-bottom')) {
      
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
});
// mobile - menu
$(function() {
    $('.menuAll-icon').on('click', function() {
        $('#header').addClass('open');
        $('body').css('overflow', 'hidden');
    });

    $('.m-menu-close').on('click', function() {
        $('#header').removeClass('open');
        $('body').css('overflow', 'visible');

        setTimeout(function() {
            $('#m-main-nav > li').eq(0).addClass('active').siblings().removeClass('active');
            $('.m-sub-nav').eq(0).addClass('active').siblings().removeClass('active');
            $('.submenu-list').hide();
            $('.m-sub-nav > li').removeClass('on');
        }, 400); 
    });

    $('#m-main-nav > li').on('click', function(e) {
        e.preventDefault();
        const idx = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        
        $('.m-sub-nav').removeClass('active').eq(idx).addClass('active');
        $('.m-sub-nav > li').removeClass('on');
        $('.submenu-list').slideUp();
    });

    $('.m-sub-nav > li').off('click').on('click', function(e) {
        // 화살표가 있는 메뉴(하위 메뉴가 있는 경우)만 실행
        const hasSub = $(this).find('.submenu-list').length > 0;
        
        if (hasSub) {
            // a 태그 클릭 시 페이지 상단으로 튕기는 것 방지
            e.preventDefault(); 
            e.stopPropagation();

            const $thisList = $(this).find('.submenu-list');
            const isOpen = $(this).hasClass('on');

            // 모든 형제 메뉴들의 'on' 클래스 제거 및 리스트 닫기 (나머지 초기화)
            $(this).siblings('li').removeClass('on').find('.submenu-list').slideUp(300);

            // 현재 클릭한 메뉴 토글
            if (isOpen) {
                $(this).removeClass('on');
                $thisList.stop().slideUp(300);
            } else {
                $(this).addClass('on');
                $thisList.stop().slideDown(300);
            }
        }
    });
});


