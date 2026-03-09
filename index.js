$(document).ready(function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // [기존 그대로] 스와이퍼 초기 설정
  const newsSwiper = new Swiper(".news-swiper", {
    slidesPerView: 3,
    spaceBetween: 30,
    loop: true,
    observer: true,
    observeParents: true,
    watchOverflow: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      320: { slidesPerView: 1.1, spaceBetween: 15 },
      1024: { slidesPerView: 3, spaceBetween: 30 },
    },
  });

  // [기존 그대로] 헤더 호버
  $("#header").on("mouseenter", function () {
    if ($(window).width() > 1024) $(this).addClass("open");
  });
  $("#header").on("mouseleave", function () {
    if ($(window).width() > 1024) $(this).removeClass("open");
  });

  // [기존 그대로] 모바일 메뉴
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

  // [기존 그대로] 퀵메뉴 스크롤
  $(".quick-list li a").on("click", function (e) {
    e.preventDefault();
    const target = $(this).attr("href");
    gsap.to(window, {
      scrollTo: { y: target, autoKill: false },
      duration: 1,
      ease: "power2.inOut",
    });
  });

  // [기존 그대로] 비디오 컨트롤
  const video = document.getElementById("intro_video");
  const progressBar = $(".video-progress-bar");
  const videoBtn = $(".video-ctrl-btn");

  videoBtn.on("click", function () {
    if (video.paused) {
      video.play();
      video.muted = false;
      $(this).removeClass("play");
    } else {
      video.pause();
      $(this).addClass("play");
    }
  });

  if (video) {
    video.addEventListener("timeupdate", function () {
      const percentage = (video.currentTime / video.duration) * 100;
      progressBar.css("width", percentage + "%");
    });
  }

  // [기존 그대로] 카운팅 애니메이션
  gsap.from(".info-intro .count-num", {
    innerText: 0,
    duration: 2,
    snap: { innerText: 1 },
    scrollTrigger: {
      trigger: ".info-intro",
      start: "top 80%",
    },
  });

  // [기존 그대로] 섹션 01 풀페이지 자석
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

  // [기존 그대로] 헤더 다크모드 전환
  ScrollTrigger.create({
    trigger: ".section02",
    start: "top 80px",
    end: "bottom 80px",
    onEnter: () => $("#header").addClass("dark"),
    onLeave: () => $("#header").removeClass("dark"),
    onEnterBack: () => $("#header").addClass("dark"),
    onLeaveBack: () => $("#header").removeClass("dark"),
  });

  // --- [가로 스크롤 타임라인 시작] ---
  const track = document.querySelector(".history-track");
  const items = gsap.utils.toArray(".history-item");
  const zoomBg = document.querySelector(".history-zoom-bg");
  const zoomContent = document.querySelector(".history-zoom-content");

  const historyTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".info-history-horizontal",
      start: "top top",
      end: "+=8000",
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      snap: {
        snapTo: "labels",
        duration: 0.3,
        delay: 0,
        ease: "power1.inOut",
      },
    },
  });

  items.forEach((item, i) => {
    historyTL.addLabel("step" + i);
    if (i < items.length - 1) {
      historyTL.to(track, {
        x: () =>
          -(
            ((track.scrollWidth - window.innerWidth) / (items.length - 1)) *
            (i + 1)
          ),
        ease: "none",
        duration: 1,
        onUpdate: function () {
          items.forEach((el, idx) => {
            if (idx === i) el.classList.add("active");
            else el.classList.remove("active");
          });
        },
      });
    }
  });

  historyTL.addLabel("zoomStart");

  historyTL
    .to([track, ".history-title"], { opacity: 0, duration: 0.5 }, "+=0.2")
    .to(
      zoomBg,
      {
        autoAlpha: 1,
        scale: 1,
        duration: 1,
        onStart: () => {
          document
            .querySelector(".info-history-horizontal")
            .classList.add("show-fog");
        },
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
    // ★ 여기가 핵심! 섹션 3가 올라온 직후 스와이퍼를 깨워줘야 함
    .to(".section03", {
      marginTop: -1,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        newsSwiper.update(); // 스와이퍼한테 "이제 니 자리야, 계산해!"라고 명령
      },
    });

  // [기존 그대로] 섹션 03 자석 효과
  ScrollTrigger.create({
    trigger: ".section03",
    start: "top 20%",
    onEnter: () => {
      gsap.to(window, {
        scrollTo: { y: ".section03", autoKill: false },
        duration: 1,
        ease: "power2.inOut",
      });
    },
  });

  // [수정] 뉴스 카드 등장 애니메이션 (스와이퍼가 준비된 후에 보이게 트리거 시점 조정)
  gsap.from(".news-card-item", {
    scrollTrigger: {
      trigger: ".section03", // news-swiper 대신 섹션 자체를 트리거로
      start: "top 30%",
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
  });

  // [기존 그대로] 하단 그리드 애니메이션
  gsap.from(".sub-box", {
    scrollTrigger: {
      trigger: ".news-sub-grid",
      start: "top 85%",
    },
    x: (i) => (i === 0 ? -50 : 50),
    opacity: 0,
    duration: 1,
    ease: "power2.out",
  });
});
