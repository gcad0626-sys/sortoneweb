const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

// 가운데(.organize__middle)와 오른쪽(.organize__output) 초기 숨김 추가
// organizeTl 선언 뒤에 gsap.set 삽입
const setInitialTarget = `const scoreEl = document.getElementById("scoreVal");`;
const setInitialReplacement = `const scoreEl = document.getElementById("scoreVal");

// 가운데 & 오른쪽 패널 초기 숨김 (scrub 시작 전)
gsap.set(".organize__middle", { opacity: 0, scale: 0.85 });
gsap.set(".organize__output", { opacity: 0, x: 30 });`;

code = code.replace(setInitialTarget, setInitialReplacement);

// 타임라인에 가운데/오른쪽 페이드인 추가
// 좌측 핸드폰 after 1 (그림자 모션), 가운데는 타이핑 시작 타이밍에 맞춰, 오른쪽은 스캔라인 직전
// 가운데 pill: 타이핑 시작(0.5)쯤에 나타나도록
const pillScaleTarget = `  // 제자리 호흡 모션 (Scale): 빨간 배지가 제자리에서 살짝 커지며 강조됨
  .to("#analyzingPill", {
    scale: 1.08,`;

const pillScaleReplacement = `  // 가운데 Analyzing Pill 등장
  .to(".organize__middle", {
    opacity: 1,
    scale: 1,
    duration: 1.5,
    ease: "back.out(1.4)"
  }, 1.5)

  // 오른쪽 결과 패널 등장
  .to(".organize__output", {
    opacity: 1,
    x: 0,
    duration: 2,
    ease: "power2.out"
  }, 2.5)

  // 제자리 호흡 모션 (Scale): 빨간 배지가 제자리에서 살짝 커지며 강조됨
  .to("#analyzingPill", {
    scale: 1.08,`;

code = code.replace(pillScaleTarget, pillScaleReplacement);

// 부드러운 네비게이션 스크롤 추가
const navScrollCode = `
// --- Smooth Navigation Scrolling ---
document.querySelectorAll('.nav-link, .dot').forEach(el => {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    const target = this.getAttribute('href') || ('#' + this.getAttribute('data-dot'));
    if (target && target !== '#') {
      gsap.to(window, {
        scrollTo: { y: target, autoKill: false },
        duration: 1.5,
        ease: 'power2.inOut'
      });
    }
  });
});
`;
code += navScrollCode;

fs.writeFileSync('script.js', code, 'utf8');
console.log('Done!');
