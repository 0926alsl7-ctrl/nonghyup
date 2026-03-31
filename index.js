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
  const visuals = gsap.utils.toArray(".visual-item");
  const zoomBg = document.querySelector(".history-zoom-bg");
  const zoomContent = document.querySelector(".history-zoom-content");

  function animateYear($el, targetYear) {
    const currentYear = parseInt($el.text());
    if (currentYear === targetYear) return;

    gsap.to(
      { val: currentYear },
      {
        val: targetYear,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: function () {
          $el.text(Math.floor(this.targets()[0].val));
        },
      },
    );
  }
  const historyTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".info-history-horizontal",
      start: "top top",
      end: "+=10000", // 더 길게 잡아서 스크롤 속도를 늦춤 (부드러움의 비결)
      scrub: 1.5, // 0.8에서 1.5로 올림. 스크롤을 멈춰도 슬라이딩이 부드럽게 따라옴
      pin: true,
    },
  });

  items.forEach((item, i) => {
    // 1. 텍스트 카드가 왼쪽 15% 위치에 딱 멈추도록 이동
    historyTL.to(
      track,
      {
        x: () => -(item.offsetLeft - window.innerWidth * 0.15),
        duration: 1,
        ease: "power2.inOut",
        onUpdate: () => {
          // 2. 현재 활성화된 아이템 체크
          const progress = historyTL.scrollTrigger.progress;
          // 섹션별로 사진 활성화 클래스 조절
          visuals.forEach((vs, idx) =>
            vs.classList.toggle("active", idx === i),
          );
          items.forEach((it, idx) => it.classList.toggle("active", idx === i));

          // 상단 타이틀 년도도 부드럽게 업데이트
          const currentYear = items[i].getAttribute("data-year");
          animateYear($(".big-year-display"), currentYear);
        },
      },
      i === 0 ? 0 : "-=0.5",
    ); // 타임라인을 살짝 겹쳐서 블럭 느낌 제거
  });

  historyTL
    .addLabel("zoomStart")
    .to([track, ".history-title"], { autoAlpha: 0, duration: 0.5 }, "+=0.2")
    .to(
      ".history-zoom-bg",
      {
        autoAlpha: 1,
        scale: 1,
        duration: 1.5,
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
            {
              innerText: 65,
              duration: 1.4,
              snap: { innerText: 1 },
              ease: "power1.inOut",
            },
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
    start: "top 98%",
    onEnter: () => {
      gsap.to(".section03", {
        opacity: "0",
        duration: 1.5,
        ease: "power2.inOut",
      });

      // gsap.to(window, {
      //   scrollTo: ".section04",
      //   duration: 1.2,
      //   ease: "power2.inOut",
      // });

      $(".value-banner.split").each(function (i, el) {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: 1.8,
          delay: 0.3 + i * 0.4,
          ease: "power4.out",
        });
      });
    },
    onLeaveBack: () => {
      gsap.to(".section03", { backgroundColor: "#0a0c28", duration: 1 });
    },
  });
});
