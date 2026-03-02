$(function () {
  $(".gnb").on("mouseenter", function () {
    if ($(window).width() > 1024) {
      $("#header").addClass("open");
    }
  });

  $("#header").on("mouseleave", function () {
    if ($(window).width() > 1024) {
      $(this).removeClass("open");
    }
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
});
$(document).ready(function() {
    const video = document.getElementById('intro_video');
    const progressBar = $('.video-progress-bar');
      $('.video-container').on('click', function() {
        if (video.paused) {
            video.play();
            video.muted = false; // 재생할 때 소리 켜기 (브라우저 정책 대응)
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
        autoScrolling: true,
        scrollHorizontally: true,
        navigation: false,
        navigationPosition: 'left',
        anchors: ['intro', 'information', 'news', 'about', 'footer'],
        
        afterLoad: function(origin, destination, direction) {
            if(destination.anchor == 'intro'){
                video.play();
            }
        }
    });
});

