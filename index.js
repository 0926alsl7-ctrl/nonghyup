$(document).ready(function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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

  $(".header_wrap .gnb > li > a")
    .off("click")
    .on("click", function (e) {
      if ($(window).width() <= 1024) {
        e.preventDefault();
        const $thisLi = $(this).parent("li");
        const $targetDepth = $thisLi.find(".depth2_wrap");
        $thisLi
          .siblings("li")
          .removeClass("active")
          .find(".depth2_wrap")
          .stop()
          .slideUp(300);
        $thisLi.toggleClass("active");
        $targetDepth.stop().slideToggle(300);
      }
    });

  $(".quick-list li a").on("click", function (e) {
    e.preventDefault();
    const target = $(this).attr("href");
    gsap.to(window, {
      scrollTo: { y: target, autoKill: false },
      duration: 1,
      ease: "power2.inOut",
    });
  });

  const video = document.getElementById("intro_video");
  const progressBar = $(".video-progress-bar");
  const videoBtn = $(".video-ctrl-btn");

  videoBtn.on("click", function () {
    if (video.paused) {
      video.play();
      video.muted = false; // 음소거 해제
      $(this).removeClass("play"); // 아이콘 변경
    } else {
      video.pause();
      $(this).addClass("play"); // 아이콘 변경
    }
  });

  if (video) {
    video.addEventListener("timeupdate", function () {
      const percentage = (video.currentTime / video.duration) * 100;
      progressBar.css("width", percentage + "%");
    });
  }

  gsap.from(".info-intro .count-num", {
    innerText: 0,
    duration: 2,
    snap: { innerText: 1 },
    scrollTrigger: {
      trigger: ".info-intro",
      start: "top 80%",
    },
  });

  ScrollTrigger.create({
    trigger: ".section01",
    start: "top top",
    end: "bottom center",
    onLeave: () => {
      gsap.to(window, {
        scrollTo: "#information",
        duration: 1.2,
        ease: "power2.inOut",
      });
    },
  });

  ScrollTrigger.create({
    trigger: ".section02",
    start: "top 80px",
    end: "bottom 80px",
    onEnter: () => $("#header").addClass("dark"),
    onLeave: () => $("#header").removeClass("dark"),
    onEnterBack: () => $("#header").addClass("dark"),
    onLeaveBack: () => $("#header").removeClass("dark"),
  });

  // --- [2. 가로 스크롤 + 줌 애니메이션 통합] ---
  const track = document.querySelector(".history-track");
  const items = gsap.utils.toArray(".history-item");
  const zoomBg = document.querySelector(".history-zoom-bg");
  const zoomContent = document.querySelector(".history-zoom-content");

  const historyTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".info-history-horizontal",
      start: "top top",
      end: "+=8000",
      scrub: 1, // 쫀득함 유지
      pin: true,
      anticipatePin: 1,
      // snap 설정을 밖으로 빼서 'labels' 방식으로 변경
      snap: {
        snapTo: "labels", // 레이블이 있는 곳에만 딱딱 멈춤!
        duration: 0.3,
        delay: 0,
        ease: "power1.inOut",
      },
    },
  });

  // 2. 가로 이동 단계마다 레이블 추가 (이래야 지 혼자 끝까지 안 감)
  // 총 이동 거리를 아이템 개수로 나눠서 단계별로 label을 심어줌
  items.forEach((item, i) => {
    historyTL.addLabel("step" + i); // 멈춰야 할 포인트 레이블 생성

    if (i < items.length - 1) {
      // 다음 아이템으로 가는 애니메이션
      historyTL.to(track, {
        x: () =>
          -(
            ((track.scrollWidth - window.innerWidth) / (items.length - 1)) *
            (i + 1)
          ),
        ease: "none",
        duration: 1, // 단계별 가중치
        onUpdate: function () {
          // 현재 진행도에 따른 active 클래스 처리
          items.forEach((el, idx) => {
            if (idx === i) el.classList.add("active");
            else el.classList.remove("active");
          });
        },
      });
    }
  });

  historyTL.addLabel("zoomStart");

  // 줌 연출 및 섹션 3 등장 (이 부분만 이렇게 덮어써!)
  historyTL
    .to([track, ".history-title"], { opacity: 0, duration: 0.5 }, "+=0.2")
    .to(
      zoomBg,
      {
        autoAlpha: 1,
        scale: 1,
        duration: 1,
        // [추가] 줌 배경이 나타나기 시작할 때 안개도 같이 등장!
        onStart: () => {
          document
            .querySelector(".info-history-horizontal")
            .classList.add("show-fog");
        },
        // [추가] 뒤로 스크롤해서 돌아갈 때는 안개 제거!
        onReverseComplete: () => {
          document
            .querySelector(".info-history-horizontal")
            .classList.remove("show-fog");
        },
      },
      "-=0.3",
    )
    .to(
      zoomContent,
      {
        autoAlpha: 1,
        duration: 1,
        onStart: () => {
          // 65년 카운팅
          const count65 = document.querySelector(
            ".history-zoom-content .count-num",
          );
          gsap.fromTo(
            count65,
            { innerText: 0 },
            { innerText: 65, duration: 1.5, snap: { innerText: 1 } },
          );
        },
      },
      "-=0.5",
    )
    .addLabel("section3Enter")
    .to(".section03", { marginTop: 0, duration: 1.5, ease: "power2.inOut" });
});
