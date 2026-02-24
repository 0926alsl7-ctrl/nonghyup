$(function () {
  // [1] PC: 서브메뉴 전체 열기 (구조 변경 대응)
  // gnb에 마우스 올리면 header에 open 클래스 추가
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

  // [2] 모바일: 메뉴 열기 (딤드 없이 꽉 차게)
  $(".all_menu a").on("click", function (e) {
    e.preventDefault();
    $(".header_wrap").addClass("m_open");
    $("body").css("overflow", "hidden"); // 본문 스크롤 방지
  });

  // [3] 모바일: 메뉴 닫기
  $(".m_close").on("click", function () {
    $(".header_wrap").removeClass("m_open");
    $("body").css("overflow", "auto"); // 본문 스크롤 복구

    // 닫을 때 열려있던 아코디언들 초기화
    $(".gnb > li").removeClass("active");
    $(".depth2_wrap").hide();
  });

$(".header_wrap .gnb > li > a").off("click").on("click", function (e) {
    if ($(window).width() <= 1024) {
        e.preventDefault();

        const $thisLi = $(this).parent("li");
        const $targetDepth = $thisLi.find(".depth2_wrap");

        // 다른 메뉴 닫기
        $thisLi.siblings("li").removeClass("active").find(".depth2_wrap").stop().slideUp(300);

        // 내 메뉴 토글 (중요: 모바일에서 height:auto 강제)
        $thisLi.toggleClass("active");
        $targetDepth.stop().slideToggle(300);
    }
});

});
$(document).ready(function() {
    $('#fullpage').fullpage({
        // 옵션 세팅
        autoScrolling: false,
        scrollOverflow: false,
        scrollingSpeed: 700, 
        scrollHorizontally: true,
        navigation: true, // 우측에 도트 네비게이션 표시
        navigationPosition: 'left',
        anchors: ['intro', 'information', 'news', 'about', 'footer'], // 캡처에 있는 data-anchor 매칭
        
        // 섹션 로드 후 실행 (비디오 자동 재생 보정)
        afterLoad: function(anchorLink, index) {
            if(index == 'intro'){
                document.getElementById('introMovie').play();
                document.getElementById('introMovie').play();
                document.getElementById('muteBtn').style.backgroundImage = "url('image/main_mute.png')";
                
            }
        }
    });
});
