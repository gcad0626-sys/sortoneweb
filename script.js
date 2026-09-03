gsap.registerPlugin(ScrollTrigger);

const EASE = "cubic-bezier(.16,1,.3,1)";
const EASE_GSAP = "power3.out";

/* =========================================================
   HEADER SCROLL STATE + PAGE INDICATOR SYNC
========================================================= */
const header = document.getElementById("header");
const sections = ["intro", "organize", "insight", "find"].map(id => document.getElementById(id));
const navLinks = document.querySelectorAll(".nav-link");
const dots = document.querySelectorAll(".dot");

ScrollTrigger.create({
  start: 40,
  onUpdate: (self) => {
    header.classList.toggle("is-scrolled", self.scroll() > 40);
  }
});


/* =========================================================
   01 INTRO — reveal + mouse micro-move
========================================================= */
const introTl = gsap.timeline({ 
  defaults: { ease: EASE_GSAP },
  scrollTrigger: {
    trigger: "#intro",
    start: "top 75%",
    toggleActions: "play none none none"
  }
});

introTl
  .from(".intro__title .line", {
    yPercent: 130,
    opacity: 0,
    duration: 2.4,
    stagger: 0.22,
    ease: "power3.out"
  })
  .from(".intro__desc .line", {
    yPercent: 100,
    opacity: 0,
    duration: 1.4,
    stagger: 0.15,
    ease: "power3.out"
  }, "-=1.0")
  .from(".intro__qr", { y: 20, opacity: 0, duration: 1.0 }, "-=0.6")
  .to(".qr-label .highlight-text", { backgroundSize: "100% 100%", duration: 0.8, ease: "power2.out" }, "-=0.3");

// Phone mockup: 별도 애니메이션 (페이지 최상단에서도 안정적으로 동작)
gsap.from(".phone-mockup", {
  y: 40,
  opacity: 0,
  scale: 0.95,
  duration: 1.4,
  ease: "power3.out",
  delay: 0.6
});

// 오버레이 카드: 목업 등장 후 뿅뿅 순서대로 팝업
gsap.to(".overlay-card", {
  opacity: 1,
  y: 0,
  duration: 0.55,
  stagger: 0.18,
  ease: "back.out(1.8)",
  delay: 1.4  // 목업 등장(0.6 + 1.4s duration) 이후 시작
});

// Continuous shake for AI text (with initial delay to wait for intro animation)
gsap.to(".intro__title em", {
  keyframes: [
    { rotation: 8, duration: 0.1 },
    { rotation: -8, duration: 0.1 },
    { rotation: 5, duration: 0.1 },
    { rotation: -5, duration: 0.1 },
    { rotation: 0, duration: 0.1 }
  ],
  ease: "power1.inOut",
  repeat: -1,
  repeatDelay: 3,
  delay: 2 // Start shaking after 2 seconds
});

// subtle mouse-follow micro move on the intro visual
const introVisual = document.getElementById("introVisual");
const phoneMockup = document.querySelector(".phone-mockup");
const badges = gsap.utils.toArray(".float-badge");

if (window.matchMedia("(pointer: fine)").matches) {
  introVisual.addEventListener("mousemove", (e) => {
    const rect = introVisual.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(phoneMockup, {
      x: relX * 14,
      y: relY * 10,
      duration: 1.2,
      ease: "power3.out"
    });
  });

  introVisual.addEventListener("mouseleave", () => {
    gsap.to(phoneMockup, { x: 0, y: 0, duration: 1 });
  });
}

/* bouncy and independent continuous float loop for badges */
badges.forEach((b, i) => {
  const randomY = 12 + Math.random() * 12;
  const randomX = (Math.random() - 0.5) * 15;
  const randomRot = (Math.random() - 0.5) * 12;
  
  gsap.to(b, {
    y: `+=${randomY}`,
    x: `+=${randomX}`,
    rotation: randomRot,
    duration: 1.2 + Math.random() * 1.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: Math.random() * 2
  });
});

/* Intro exit subtle interaction on scroll down */
gsap.timeline({
  scrollTrigger: {
    trigger: "#intro",
    start: "top -10%",
    toggleActions: "play reverse play reverse"
  }
})
.to(".intro__copy", { y: -40, opacity: 0.5, duration: 0.8, ease: "power2.inOut" }, 0)
.to(".intro__visual", { scale: 0.98, duration: 0.8, ease: "power2.inOut" }, 0);

/* =========================================================
   02 AI ORGANIZE — Dynamic Scrubbing Interaction
========================================================= */
const organizeTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#organize",
    start: "center center",
    end: "+=250%",
    scrub: 1,
    pin: true,
    anticipatePin: 1
  }
});

const typeTarget = document.querySelector(".editor-box");
const textToType = "신규 프로젝트 킥오프 미팅 요약 비즈니스 성장 전략 및 핵심 성과 도출을 위한 새로운 아이디어 논의";
const typeObj = { progress: 0 };
const scoreObj = { val: 0 };
const scoreEl = document.getElementById("scoreVal");

organizeTl
  // Step 1 (입력): 기존 텍스트 지우고 타이핑 효과 시작
  .call(() => { if(typeTarget) typeTarget.innerText = ""; }) // 기존 텍스트 초기화
  .to(typeObj, {
    progress: 100,
    duration: 2.5,
    ease: "none",
    onUpdate: function() {
      const length = Math.floor((typeObj.progress / 100) * textToType.length);
      if(typeTarget) typeTarget.innerHTML = textToType.substring(0, length) + "<span class='blink'>|</span>";
    }
  }, 0)
  
  // Step 2 (분석): AI ANALYZING 배지 펄스 활성화
  .to("#analyzingPill", {
    scale: 1.15,
    boxShadow: "0 0 0 20px rgba(255,59,48, 0)",
    duration: 1.2,
    ease: "power2.out"
  }, "+=0.2")
  .to("#analyzingPill", { scale: 1, duration: 0.5 }, "-=0.5") // 펄스 후 원래 크기로 복귀

  // Step 3 (분류/이동): 우측 패널의 카테고리 및 태그들이 왼쪽에서부터 날아오기
  .from("#outCategory .output-value, #outTags .chip", {
    x: -550, // 좌측 스마트폰 부근에서 출발
    y: 120,
    opacity: 0,
    scale: 0.3,
    stagger: 0.3,
    duration: 2,
    ease: "power3.out"
  }, "-=0.5")

  // Step 4 (스코어): CONFIDENCE SCORE 카운트업
  .to(scoreObj, {
    val: 98,
    duration: 1.5,
    ease: "power2.out",
    onUpdate: function() {
      if(scoreEl) scoreEl.innerText = Math.round(scoreObj.val);
    }
  }, "-=1.0");


/* =========================================================
   03 AI INSIGHT — Pinned Scrubbing Interaction
========================================================= */
const insightTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#insight",
    start: "center center", // 화면 중앙에 예쁘게 배치되었을 때 고정
    end: "+=200%",    // 200% 만큼 스크롤 고정
    scrub: 1,         // 스크러빙
    pin: true,
    anticipatePin: 1
  }
});

const insightStatCount = document.getElementById("insightStatCount");
const insightStatEff = document.getElementById("insightStatEff");
const insightStatObj1 = { val: 0 };
const insightStatObj2 = { val: 0 };

// 요소 초기 상태 (타임라인 전)
gsap.set(".insight__col--left > *:not(.insight__stats)", { opacity: 0, y: 30 });
gsap.set(".insight__stats", { opacity: 0, y: 30 });
gsap.set(".insight-center-img", { opacity: 0, y: 50 });
gsap.set(".side-card", { opacity: 0, y: 40 });
gsap.set(".side-quote", { opacity: 0 });

insightTl
  // Step 1: 좌측 텍스트 및 통계
  .to(".insight__col--left > *:not(.insight__stats)", { opacity: 1, y: 0, duration: 1, stagger: 0.2 })
  .to(".insight__stats", { opacity: 1, y: 0, duration: 1 }, "-=0.5")
  .to(insightStatObj1, { 
    val: 24, 
    duration: 1.5, 
    ease: "power2.out",
    onUpdate: () => { if(insightStatCount) insightStatCount.innerText = Math.round(insightStatObj1.val); }
  }, "-=0.5")
  .to(insightStatObj2, { 
    val: 15, 
    duration: 1.5, 
    ease: "power2.out",
    onUpdate: () => { if(insightStatEff) insightStatEff.innerText = Math.round(insightStatObj2.val); }
  }, "-=1.5")
  
  // Step 2: 중앙 이미지 슬라이드 업
  .to(".insight-center-img", { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, "-=0.5")
  
  // Step 3: 우측 패널 연동
  .to(".insight-card, .side-card", { opacity: 1, y: 0, duration: 1.5, stagger: 0.5, ease: "power2.out" }, "-=1")
  
  // Step 4: 하단 카피
  .to(".side-quote", { opacity: 1, duration: 1.5, ease: "power2.out" }, "-=0.5");

/* =========================================================
   04 FIND — search results unfold + tag slide-in
========================================================= */
const findTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#find",
    start: "center center",
    end: "+=150%",
    pin: true,
    scrub: 1,
    anticipatePin: 1
  }
});

// Set initial states for elements that will be scrubbed
gsap.set(".search-tags-row, [data-find-result]", { y: -15, opacity: 0 });
gsap.set(".find-phone-img", { y: 20, opacity: 0 });

findTl
  // Step 1: Left search bar border highlights
  .to(".find__panel .search-bar", { borderColor: "#4396FF", boxShadow: "0 0 0 2px rgba(67, 150, 255, 0.15)", duration: 1 })
  // Step 2: Tags and result cards slide down smoothly
  .to(".search-tags-row", { y: 0, opacity: 1, duration: 1 }, "+=0.5")
  .to("[data-find-result]", { y: 0, opacity: 1, duration: 1.5, stagger: 0.4 }, "-=0.5")
  // Step 3: Right smartphone mockup screen naturally fades in
  .to(".find-phone-img", { y: 0, opacity: 1, duration: 2 }, "-=1");

/* =========================================================
   SECTION HEADERS REVEAL
========================================================= */
gsap.utils.toArray(".section-header, .section-head").forEach(head => {
  gsap.from(head.children, {
    scrollTrigger: {
      trigger: head,
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: EASE_GSAP
  });
});

/* =========================================================
   FINAL CTA — reveal + floating hover already handled in CSS
========================================================= */
gsap.from("#cta [data-reveal]", {
  scrollTrigger: {
    trigger: "#cta",
    start: "top 70%",
    once: true
  },
  y: 30,
  opacity: 0,
  duration: 0.9,
  stagger: 0.12,
  ease: EASE_GSAP
});

gsap.to("#cta .highlight-text--blue", {
  scrollTrigger: {
    trigger: "#cta",
    start: "top 70%",
    toggleActions: "play none none reverse"
  },
  backgroundSize: "100% 100%",
  duration: 0.8,
  delay: 0.5,
  stagger: 0.3,
  ease: "power2.out"
});

/* refresh on load once fonts/images settle */
window.addEventListener("load", () => ScrollTrigger.refresh());

/* Navigation active state update (must be at the bottom so it respects pinned sections) */
function setActive(key) {
  navLinks.forEach(l => l.classList.toggle("is-active", l.dataset.nav === key));
  dots.forEach(d => d.classList.toggle("is-active", d.dataset.dot === key));
}

sections.forEach((section, index) => {
  ScrollTrigger.create({
    trigger: section,
    start: "top 50%",
    onEnter: () => setActive(section.id),
    onLeaveBack: () => {
      if (index > 0) setActive(sections[index - 1].id);
    }
  });
});
