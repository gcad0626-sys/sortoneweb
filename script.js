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
   01 INTRO — reveal + typing
========================================================= */
const introCursor = document.createElement("span");
introCursor.className = "intro-cursor blink";
introCursor.textContent = "|";

function wrapChars(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent;
    const fragment = document.createDocumentFragment();
    for (let char of text) {
      if (char.trim() === '') {
        fragment.appendChild(document.createTextNode(char));
      } else {
        const span = document.createElement('span');
        span.className = 'typer-char';
        span.textContent = char;
        fragment.appendChild(span);
      }
    }
    node.parentNode.replaceChild(fragment, node);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    Array.from(node.childNodes).forEach(wrapChars);
  }
}

document.querySelectorAll(".intro__title .line").forEach(line => {
  Array.from(line.childNodes).forEach(wrapChars);
});

const allTyperChars = document.querySelectorAll(".intro__title .typer-char");
if (allTyperChars.length > 0) {
  allTyperChars[0].parentNode.insertBefore(introCursor, allTyperChars[0]);
}

let typerIndex = 0;
function startIntroTyping() {
  if (typerIndex < allTyperChars.length) {
    const charEl = allTyperChars[typerIndex];
    charEl.classList.add("is-visible");
    charEl.parentNode.insertBefore(introCursor, charEl.nextSibling);
    typerIndex++;
    // 조금 더 느긋하게 (110ms 기본 + 40ms 변주)
    setTimeout(startIntroTyping, 110 + Math.random() * 40);
  } else {
    gsap.to(introCursor, { opacity: 0, duration: 0.5, delay: 1 });
  }
}

const introTl = gsap.timeline({ 
  defaults: { ease: EASE_GSAP },
  scrollTrigger: {
    trigger: "#intro",
    start: "top 75%",
    toggleActions: "play none none none"
  }
});

introTl
  .add(() => startIntroTyping(), 0)
  .from(".intro__desc .line", {
    yPercent: 100,
    opacity: 0,
    duration: 1.4,
    stagger: 0.15,
    ease: "power3.out"
  }, "+=0.5")
  .from(".intro__qr", { y: 20, opacity: 0, duration: 1.0 }, "-=0.6")
  .to(".qr-label .highlight-text", { backgroundSize: "100% 100%", duration: 0.6, stagger: 0.2, ease: "power2.out" }, "-=0.3");

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
.to(".intro__copy", { y: -40, duration: 0.8, ease: "power2.inOut" }, 0)
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
    anticipatePin: 1,
    onEnter: () => document.getElementById("analyzingPill")?.classList.add("is-pulsing"),
    onLeave: () => document.getElementById("analyzingPill")?.classList.remove("is-pulsing"),
    onEnterBack: () => document.getElementById("analyzingPill")?.classList.add("is-pulsing"),
    onLeaveBack: () => document.getElementById("analyzingPill")?.classList.remove("is-pulsing")
  }
});

const typeTarget = document.querySelector(".editor-box");
const textToType = "신규 프로젝트 킥오프 미팅 요약 비즈니스 성장 전략 및 핵심 성과 도출을 위한 새로운 아이디어 논의";
const typeObj = { progress: 0 };
const scoreObj = { val: 0 };
const scoreEl = document.getElementById("scoreVal");

organizeTl
  // 1. 좌측 스마트폰 목업 3D 틸트 슬라이드 & 페이드인
  .from(".organize__phone-wrap", {
    x: -40,
    y: 20,
    opacity: 0,
    scale: 0.95,
    rotationY: -15, // 3D tilt
    rotationZ: -2,
    duration: 2.5,
    ease: "power2.out"
  }, 0)
  // 0a. 가운데 Analyzing Pill 등장
  .to(".organize__middle", {
    opacity: 1,
    scale: 1,
    duration: 1.5,
    ease: "back.out(1.4)"
  }, 1.0)
  // 0b. 오른쪽 결과 패널 등장
  .to(".organize__output", {
    opacity: 1,
    x: 0,
    duration: 2,
    ease: "power2.out"
  }, 1.5)
  // 2. 안착 후 하단 그림자가 짙어지며 가볍게 떠오르는 호흡 모션
  // (스크러빙에 연동되므로 스크롤을 내릴수록 그림자가 짙어지고 살짝 뜹니다)
  .to(".organize__phone-wrap", {
    y: -8,
    filter: "drop-shadow(0 25px 25px rgba(67, 150, 255, 0.4))",
    duration: 2,
    ease: "sine.inOut"
  }, 1) // 약간 늦게 시작

  // Step 1 (입력): 기존 텍스트 지우고 타이핑 효과 시작
  .call(() => { if(typeTarget) typeTarget.innerText = ""; }, null, 0.5) // 기존 텍스트 초기화
  .to(typeObj, {
    progress: 100,
    duration: 3.5, // 텍스트 타이핑 속도를 늦춤 (스크롤 대비 더 길게)
    ease: "none",
    onUpdate: function() {
      const length = Math.floor((typeObj.progress / 100) * textToType.length);
      if(typeTarget) typeTarget.innerHTML = textToType.substring(0, length) + "<span class='blink'>|</span>";
    }
  }, 0.5)

  // 제자리 호흡 모션 (Scale): 빨간 배지가 제자리에서 살짝 커지며 강조됨
  .to("#analyzingPill", {
    scale: 1.08,
    duration: 1,
    ease: "power2.inOut"
  }, "-=0.5")

  // 우측 패널 스캔라인 효과 (위에서 아래로 쓸고 지나감)
  .to("#orgScanline", {
    opacity: 1,
    top: "120%",
    duration: 2.5,
    ease: "power1.inOut"
  }, "-=0.8")

  // Step 3 (분류/이동): 우측 패널의 카테고리 및 태그들이 스캔과 함께 나타남
  .from("#outCategory .output-value, #outTags .chip", {
    x: -550, // 좌측 스마트폰 부근에서 출발
    y: 120,
    opacity: 0,
    scale: 0.3,
    stagger: 0.3,
    duration: 2,
    ease: "power3.out"
  }, "-=2.2") // 스캔라인 하강과 동기화

  // 배지 원상태 복귀
  .to("#analyzingPill", {
    scale: 1,
    duration: 1,
    ease: "power2.out"
  }, "-=1.5")

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
  
  // Step 2: 중앙 이미지 슬라이드 업 및 좌측 데이터 연결선 드로잉
  .to(".insight-center-img", { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, "-=0.5")
  .to(".insight-connect-line--left", { width: "15%", opacity: 0.6, duration: 1.5, ease: "power2.inOut" }, "-=1.5")
  
  // Step 3: 우측 패널 연동 및 우측 데이터 연결선 드로잉
  .to(".insight-connect-line--right", { width: "18%", opacity: 0.6, duration: 1.5, ease: "power2.inOut" }, "-=0.5")
  .to(".side-card", { opacity: 1, y: 0, duration: 1.5, stagger: 0.5, ease: "power2.out" }, "-=1.0")
  
  // 첫 번째 카드(ANALYSIS STATUS) 순차적 포커스 스태거 (Glow & Float) 및 프로그레스 바 채워짐
  .to(".side-card:nth-child(1)", { 
    boxShadow: "0 10px 30px rgba(67,150,255,0.15)", 
    borderColor: "rgba(67,150,255,0.3)", 
    y: -5, 
    duration: 1 
  }, "-=0.5")
  .to("#insightProgressBar", { width: "85%", duration: 1.5, ease: "power3.out" }, "-=1.0")
  
  // 두 번째 카드(ACTION ITEMS) 포커스 이동 (첫 번째는 원래대로)
  .to(".side-card:nth-child(1)", { 
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)", // 원본 shadow로 복귀
    borderColor: "var(--line)", 
    y: 0, 
    duration: 1 
  }, "+=0.2")
  .to(".side-card:nth-child(2)", { 
    boxShadow: "0 10px 30px rgba(67,150,255,0.15)", 
    borderColor: "rgba(67,150,255,0.3)", 
    y: -5, 
    duration: 1 
  }, "-=1.0")

  // Step 4: 하단 카피 및 두 번째 카드 포커스 해제
  .to(".side-card:nth-child(2)", { 
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)", 
    borderColor: "var(--line)", 
    y: 0, 
    duration: 1 
  }, "+=0.2")
  .to(".side-quote", { opacity: 1, duration: 1.5, ease: "power2.out" }, "-=1.0");

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
  // Step 0: 검색창 위에서 내려오며 페이드인 (CSS 초기: opacity:0, y:-16px)
  .to(".find__panel .search-bar", {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out"
  })

  // Step 1: 검색창 테두리 하이라이트 (입력 완료 시점)
  .to(".find__panel .search-bar", { borderColor: "#4396FF", boxShadow: "0 0 0 2px rgba(67, 150, 255, 0.15)", duration: 1 }, "+=0.2")
  
  // Step 2: Tags appear and pop
  .to(".search-tags-row", { y: 0, opacity: 1, duration: 0.5 }, "+=0.2")
  .fromTo(".search-tags .chip", { scale: 0.8 }, { scale: 1, duration: 0.5, ease: "back.out(1.7)", stagger: 0.1 }, "-=0.2")
  
  // Step 3: Cards slide down
  .to("[data-find-result]", { y: 0, opacity: 1, duration: 1, stagger: 0.3 }, "-=0.5")
  
  // Step 4: First card glow and slight scale (Match highlight)
  .to("[data-find-result]:nth-of-type(1)", {
    scale: 1.02,
    boxShadow: "0 8px 24px rgba(67, 150, 255, 0.15)",
    borderColor: "rgba(67, 150, 255, 0.4)",
    duration: 1,
    ease: "power2.out"
  }, "-=0.8")
  
  // Step 5: Second card dim (Contrast)
  .to("[data-find-result]:nth-of-type(2)", {
    opacity: 0.4,
    scale: 0.98,
    duration: 1,
    ease: "power2.out"
  }, "-=1.0")

  // Step 6: Right smartphone mockup screen naturally fades in
  .to(".find-phone-img", { y: 0, opacity: 1, duration: 2 }, "-=0.5");

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
   FINAL CTA — Scrubbing Interactions & Click
========================================================= */
const ctaTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#cta",
    start: "top 70%",
    end: "bottom 70%",
    scrub: 1,
    onEnter: () => document.getElementById("ctaButton").classList.add("pulse-glow")
  }
});

ctaTl.to(".highlight-text--cta", {
  "--hl-scale": 1,
  duration: 1,
  stagger: 0.3,
  ease: "power2.out"
});

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

// QR Code Click Transition
const qrButtons = [document.getElementById("ctaButton"), document.getElementById("introQrBtn")];
qrButtons.forEach(btn => {
  if(btn) {
    btn.addEventListener("click", () => {
      document.body.style.transition = "opacity 0.6s ease";
      document.body.style.opacity = 0;
      setTimeout(() => {
        // 지정된 링크나 앱스토어로 이동 (현재는 임시로 상단 이동 처리)
        window.scrollTo(0, 0);
        document.body.style.opacity = 1;
        alert("솔트원 앱 다운로드 페이지로 이동합니다.");
      }, 600);
    });
  }
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

// --- 상단 네비 클릭 시 완성된 화면 상태로 이동 ---
// 각 핀 섹션의 타임라인 .scrollTrigger를 직접 참조해 end 위치로 이동
const sectionTimelines = {
  organize: organizeTl,
  insight: insightTl,
  find: findTl
};

document.querySelectorAll('.nav-link, .dot').forEach(el => {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    const sectionId = this.getAttribute('href')?.replace('#', '') || this.getAttribute('data-dot');
    if (!sectionId) return;

    if (sectionId === 'intro') {
      gsap.to(window, { scrollTo: { y: 0, autoKill: false }, duration: 1.2, ease: 'power2.inOut' });
      return;
    }

    const tl = sectionTimelines[sectionId];
    if (tl && tl.scrollTrigger) {
      const st = tl.scrollTrigger;
      // st.end = 모든 scrub 애니메이션이 완료된 스크롤 위치
      // 50px 전으로 이동 → 완성된 화면을 안정적으로 유지
      gsap.to(window, {
        scrollTo: { y: st.end - 50, autoKill: false },
        duration: 1.5,
        ease: 'power2.inOut'
      });
    } else {
      const target = document.getElementById(sectionId);
      if (target) {
        gsap.to(window, { scrollTo: { y: target, autoKill: false }, duration: 1.5, ease: 'power2.inOut' });
      }
    }
  });
});
