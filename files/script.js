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
    toggleActions: "restart none restart none"
  }
});

introTl
  .from(".intro__title .line", {
    yPercent: 130,
    opacity: 0,
    duration: 1.1,
    stagger: 0.09
  })
  .from(".intro__desc", { y: 24, opacity: 0, duration: 0.9 }, "-=0.7")
  .from(".intro__qr", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
  .from("#phone1", { 
    y: 80, 
    opacity: 0, 
    scale: 0.85, 
    duration: 1.2, 
    ease: "back.out(1.5)" 
  }, "-=0.9")
  .from(".float-badge", {
    y: 40,
    opacity: 0,
    scale: 0,
    duration: 0.9,
    stagger: 0.1,
    ease: "back.out(1.7)"
  }, "-=1.0");

// Continuous shake for AI text
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
  repeatDelay: 3
});

// subtle mouse-follow micro move on the intro visual
const introVisual = document.getElementById("introVisual");
const phone1 = document.getElementById("phone1");
const badges = gsap.utils.toArray(".float-badge");

if (window.matchMedia("(pointer: fine)").matches) {
  introVisual.addEventListener("mousemove", (e) => {
    const rect = introVisual.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(phone1, {
      x: relX * 14,
      y: relY * 10,
      duration: 1.2,
      ease: "power3.out"
    });

    badges.forEach((b, i) => {
      const depth = 1 + (i % 3) * 0.6;
      gsap.to(b, {
        x: relX * 10 * depth,
        y: relY * 8 * depth,
        duration: 1.4,
        ease: "power3.out"
      });
    });
  });

  introVisual.addEventListener("mouseleave", () => {
    gsap.to(phone1, { x: 0, y: 0, duration: 1 });
    gsap.to(badges, { x: 0, y: 0, duration: 1 });
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

// prep the SVG paths for scrub-draw
const paths = gsap.utils.toArray("#organizeConnector path");
paths.forEach(p => {
  const len = p.getTotalLength();
  p.style.strokeDasharray = len;
  p.style.strokeDashoffset = len;
});

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
  // 1. text gets typed / focus state settles (phone already visible)
  .to(".phone--input .phone__input-area", { boxShadow: "inset 0 0 0 1.5px rgba(0,0,0,0.08)", duration: 0.4 })
  .to("#analyzingPill", { opacity: 1, y: 0, scale: 1, duration: 0.5 }, "-=0.1")
  .to(".suggest-tags .chip", { opacity: 1, duration: 0.4, stagger: 0.08 }, "-=0.2")

  // 2. lines draw from phone to output card
  .to("#pathA", { strokeDashoffset: 0, duration: 0.6 }, "+=0.1")
  .to("#pathB", { strokeDashoffset: 0, duration: 0.6 }, "-=0.45")
  .to("#pathC", { strokeDashoffset: 0, duration: 0.6 }, "-=0.45")

  // 3. output blocks click into place, staggered — "착착 분류"
  .to("#outCategory", { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.6)" }, "-=0.3")
  .to("#outTags", { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.6)" }, "-=0.25")
  .to("#outScore", { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.6)" }, "-=0.25")

  // 4. fade the analyzing pill back out once classification completes
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
