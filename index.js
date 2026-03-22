$(document).ready(function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  ScrollTrigger.create({
    start: "top top",
    end: 99999,
    onUpdate: (self) => {
      const currentScroll = self.scroll();
      const section02Top = $(".section02").offset().top - 10;
      const historyTop = $(".info-history-horizontal").offset().top;
      const section03Top = $(".section03").offset().top - 10;
      const section04Top = $(".section04").offset().top - 10;

      const isZoomArea =
        currentScroll > historyTop + 4500 && currentScroll < section03Top;

      if (currentScroll > section02Top) {
        if (self.direction === 1 || isZoomArea) {
          gsap.to("#header", {
            yPercent: -100,
            duration: 0.1,
            ease: "power1.out",
          });
        } else {
          gsap.to("#header", {
            yPercent: 0,
            duration: 0.1,
            ease: "power1.out",
          });

          if (currentScroll < section03Top) {
            $("#header").addClass("dark");
          } else if (
            currentScroll >= section03Top &&
            currentScroll < section04Top
          ) {
            $("#header").removeClass("dark");
          } else if (currentScroll >= section04Top) {
            $("#header").addClass("dark");
          }
        }
      } else {
        gsap.to("#header", { yPercent: 0, duration: 0.1, ease: "power1.out" });
        $("#header").removeClass("dark");
      }
    },
  });

  // 공통 ui
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

  // section01 - video ============
  const video = document.getElementById("intro_video");
  const progressBar = $(".video-progress-bar");
  const videoBtn = $(".video-ctrl-btn");

  if (video) {
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

    video.addEventListener("timeupdate", function () {
      const percentage = (video.currentTime / video.duration) * 100;
      progressBar.css("width", percentage + "%");
    });
  }

  // section01 -> section02
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

  // section02 - history
  const track = document.querySelector(".history-track");
  const items = gsap.utils.toArray(".history-item");
  const zoomBg = document.querySelector(".history-zoom-bg");
  const zoomContent = document.querySelector(".history-zoom-content");

  const historyTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".info-history-horizontal",
      start: "top top",
      end: "+=6000",
      scrub: 1,
      pin: true,
      anticipatePin: 1,
    },
  });

  items.forEach((item, i) => {
    historyTL.to(track, {
      x: () =>
        -(((track.scrollWidth - window.innerWidth) / (items.length - 1)) * i),
      duration: 1,
      ease: "none",
      onUpdate: () => {
        items.forEach((el, idx) => el.classList.toggle("active", idx === i));
      },
    });
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
        // [누나 요청 반영] 원래 코드 그대로!
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
      },
    });

  // swiper
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

  const newsTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".section03",
      start: "top 20%", // 조금 더 일찍 시작해서 여유있게
      toggleActions: "play none none none",
    },
  });

  newsTL
    .from(".news-visual-wrap", {
      y: 50,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out",
      onStart: () => initNewsSwiper(),
    })
    .from(
      ".sub-box",
      { y: 30, opacity: 0, duration: 1.2, stagger: 0.4, ease: "power2.out" },
      "-=1",
    );

  ScrollTrigger.create({
    trigger: ".section04",
    start: "top 95%", // 섹션 4가 살짝 보일 때
    onEnter: () => {
      // 1. 섹션 3 배경색을 흰색으로 부드럽게 (빨리 안바뀌게 duration 조절)
      gsap.to(".section03", {
        backgroundColor: "#ffffff",
        duration: 1.5,
        ease: "power2.inOut",
      });

      // 2. 풀페이지처럼 섹션 4로 강제 스크롤
      gsap.to(window, {
        scrollTo: ".section04",
        duration: 1.2,
        ease: "power2.inOut",
      });

      // 3. 섹션 4 배너들 순차 등장
      $(".value-banner.split").each(function (i, el) {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: 1.5,
          delay: 0.5 + i * 0.3,
          ease: "power3.out",
        });
      });
    },
    onLeaveBack: () => {
      gsap.to(".section03", { backgroundColor: "#0a0c28", duration: 1 });
    },
  });
});
