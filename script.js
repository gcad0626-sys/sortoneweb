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

sections.forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: "top 55%",
    end: "bottom 55%",
    onToggle: (self) => {
      if (!self.isActive) return;
      const key = section.id;
      navLinks.forEach(l => l.classList.toggle("is-active", l.dataset.nav === key));
      dots.forEach(d => d.classList.toggle("is-active", d.dataset.dot === key));
    }
  });
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

/* =========================================================
   02 AI ORGANIZE — pinned scrubbing keyword classification
========================================================= */
const organizeStage = document.getElementById("organizeStage");


const organizeTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#organize",
    start: "top top",
    end: "+=140%",
    scrub: 0.6,
    pin: true,
    anticipatePin: 1
  }
});

organizeTl
  // 1. AI ANALYZING 필 등장
  .to("#analyzingPill", { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.8)" })

  // 2. 아웃풋 블록 순서대로 나타남
  .to("#outCategory", { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.6)" }, "-=0.2")
  .to("#outTags",     { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.6)" }, "-=0.25")
  .to("#outScore",    { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.6)" }, "-=0.25")

  // 3. 분류 완료 후 필 페이드 아웃
  .to("#analyzingPill", { opacity: 0, y: -6, scale: 0.9, duration: 0.4 }, "+=0.2");

/* =========================================================
   03 AI INSIGHT — staggered reveal of stats & cards
========================================================= */
const insightTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#insight",
    start: "top 65%",
    once: true
  }
});

insightTl
  .from("[data-stagger='left'] > *", { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: EASE_GSAP })
  .from("[data-stagger='center'] .phone", { y: 50, opacity: 0, duration: 0.9, ease: EASE_GSAP }, "-=0.6")
  .from(".insight-card", { y: 24, opacity: 0, duration: 0.6, stagger: 0.12, ease: EASE_GSAP }, "-=0.5")
  .from("[data-stagger='right'] > *", { y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: EASE_GSAP }, "-=0.7")
  .from(".progress-bar", { scaleX: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }, "-=0.5");

// animated count-up for stat number
document.querySelectorAll("[data-count]").forEach(el => {
  const target = parseInt(el.dataset.count, 10);
  ScrollTrigger.create({
    trigger: el,
    start: "top 80%",
    once: true,
    onEnter: () => {
      gsap.to(el, {
        innerText: target,
        duration: 1.4,
        ease: "power2.out",
        snap: { innerText: 1 },
        onUpdate: function () {
          el.innerText = Math.round(this.targets()[0].innerText);
        }
      });
    }
  });
});

/* =========================================================
   04 FIND — search results unfold + tag slide-in
========================================================= */
const findTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#find",
    start: "top 60%",
    once: true
  }
});

findTl
  .from(".find__panel .search-bar", { y: 20, opacity: 0, duration: 0.7, ease: EASE_GSAP })
  .from("[data-find-tag]", { x: -16, opacity: 0, duration: 0.5, stagger: 0.08, ease: EASE_GSAP }, "-=0.4")
  .to("[data-find-result]", {
    opacity: 1,
    x: 0,
    duration: 0.7,
    stagger: 0.15,
    ease: EASE_GSAP
  }, "-=0.2")
  .from(".find__phone-wrap .phone", { y: 50, opacity: 0, duration: 0.9, ease: EASE_GSAP }, "-=0.9")
  .from(".find-suggest-tags .chip", { x: 14, opacity: 0, duration: 0.5, stagger: 0.1, ease: EASE_GSAP }, "-=0.5")
  .from(".find-recent__item", { x: 20, opacity: 0, duration: 0.5, stagger: 0.08, ease: EASE_GSAP }, "-=0.6");

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

/* refresh on load once fonts/images settle */
window.addEventListener("load", () => ScrollTrigger.refresh());
