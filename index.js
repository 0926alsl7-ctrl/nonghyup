$(document).ready(function() {
  const video = document.getElementById('intro_video');
    const progressBar = $('.video-progress-bar');
    let isCounted = false;

      function startCount() {
        if(isCounted) return;
        $('.count').each(function() {
            const $this = $(this);
            const countTo = parseInt($this.attr('data-count'));
            $({ countNum: 0 }).animate({ countNum: countTo }, {
                duration: 2000,
                easing: 'swing',
                step: function() { $this.text(Math.floor(this.countNum).toLocaleString()); },
                complete: function() { $this.text(countTo.toLocaleString()); }
            });
        });
        isCounted = true;
    }

      $("#header").on("mouseenter", function () {
        if ($(window).width() > 1024) $(this).addClass("open");
      });
      $("#header").on("mouseleave", function () {
        if ($(window).width() > 1024) $(this).removeClass("open");
    });


  $(".all_menu a").on("click", function (e) {
    e.preventDefault();
    $(".header_wrap").addClass("m_open");
    $("body").css("overflow", "hidden");
  });

  $(".m_close").on("click", function () {
    $(".header_wrap").removeClass("m_open");
    $("body").css("overflow", "auto");

    $(".gnb > li").removeClass("active");
    $(".depth2_wrap").hide();
  });

$(".header_wrap .gnb > li > a").off("click").on("click", function (e) {
    if ($(window).width() <= 1024) {
        e.preventDefault();

        const $thisLi = $(this).parent("li");
        const $targetDepth = $thisLi.find(".depth2_wrap");

        $thisLi.siblings("li").removeClass("active").find(".depth2_wrap").stop().slideUp(300);

        $thisLi.toggleClass("active");
        $targetDepth.stop().slideToggle(300);
    }
});

      $('.video-container').on('click', function() {
        if (video.paused) {
            video.play();
            video.muted = false; 
        } else {
            video.pause();
        }
    });

    if (video) {
        video.addEventListener('timeupdate', function() {
            const percentage = (video.currentTime / video.duration) * 100;
            progressBar.css('width', percentage + '%');
        });
    }

    
 $('#fullpage').fullpage({
        navigation: false,
        anchors: ['intro', 'information', 'news', 'about', 'footer'],
        
        // 2.9.7 버전은 파라미터가 (anchorLink, index) 순서야
        afterLoad: function(anchorLink, index) {
            // 인트로 섹션 (첫번째)
            if(anchorLink == 'intro'){
                $('#header').removeClass('dark');
                if(video) video.play();
            }
            // 그 외 모든 섹션
            else {
                $('#header').addClass('dark'); 
                if(anchorLink == 'news') {
                    $('#header').removeClass('dark'); // 뉴스 섹션에서는 헤더 밝게 유지
                }
            }

            // 섹션 2 (information) 진입 시
            if (anchorLink == 'information') {
                startCount(); // 숫자 카운팅
                $('.card_container').addClass('active'); // 카드 애니메이션
            }
        }
    });
});



