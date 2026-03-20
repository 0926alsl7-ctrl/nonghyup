$(document).ready(function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  let newsSwiper = null;

  function initNewsSwiper() {
    if (newsSwiper !== null) return;

    newsSwiper = new Swiper(".news-swiper", {
      slidesPerView: 3,
      spaceBetween: 30,
      loop: true,
      observer: true,
      observeParents: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        320: { slidesPerView: 1.1, spaceBetween: 15 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
      },
    });
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

  // section02 카운팅 / 자석
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

  historyTL
    .addLabel("zoomStart")
    .to([track, ".history-title"], { opacity: 0, duration: 0.5 }, "+=0.2")
    .to(
      ".history-zoom-bg",
      {
        autoAlpha: 1,
        scale: 1,
        duration: 1,
        onStart: () => $(".info-history-horizontal").addClass("show-fog"),
        onReverseComplete: () =>
          $(".info-history-horizontal").removeClass("show-fog"),
      },
      "-=0.3",
    )
    .to(
      ".history-zoom-content",
      {
        autoAlpha: 1,
        duration: 1,
        onStart: () =>
          gsap.fromTo(
            ".history-zoom-content .count-num",
            { innerText: 0 },
            { innerText: 65, duration: 1.5, snap: { innerText: 1 } },
          ),
      },
      "-=0.5",
    )
    .addLabel("section3Enter")
    .to(".section03", {
      marginTop: -1,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        initNewsSwiper();
      }, // 섹션이 완전히 올라오면 스와이퍼 시작
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

  const newsTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".section03",
      start: "top 40%", // 섹션이 보이기 시작하면
    },
  });

  newsTL
    .from(".news-visual-wrap", {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      onStart: () => {
        initNewsSwiper();
      }, // 나타나기 시작할 때 스와이퍼도 깨움
    })
    .from(
      ".sub-box",
      {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3, // 공지사항 나오고 0.3초 뒤 입찰공고 등장
        ease: "power2.out",
      },
      "-=0.5",
    ); // 스와이퍼 등장 끝나기 0.5초 전부터 시작 (자연스럽게 연결)

  // 섹션 4 배경색 전환 트리거
  gsap.to(".section03", {
    scrollTrigger: {
      trigger: ".section04", // 섹션 4가 시작될 때
      start: "top 80%", // 화면 아래쪽 80% 지점에 섹션 4가 걸리면
      end: "top 50%", // 50% 지점까지 오면서 서서히 바뀜
      scrub: true, // 스크롤 속도에 맞춰서 색 변화
    },
    opacity:"0.4",
    backgroundColor: "#fff", // 배경색을 흰색으로!
    ease: "none",
  });

  $(".value-banner.split").each(function (i, el) {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%", // 화면 85% 지점에 오면 등장
        toggleActions: "play none none none",
      },
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: "power3.out",
    });
  });
});
