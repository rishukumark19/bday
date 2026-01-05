const hand = document.querySelector(".hand-on-top");
const clutcherPng = document.querySelector(".clutcher-png-rotating");
const videoWrapper = document.querySelector(".image-wrapper");
const clutcherVidContainer = document.querySelector(".clutcher-container");
const reveal = document.querySelector(".reveal");
const sidebarClutcher = document.getElementById("sidebar-clutcher");

window.addEventListener("scroll", () => {
  const scrollPos = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  const totalScroll = docHeight - windowHeight;

  // 0. Update Sidebar Clutcher Progress
  if (sidebarClutcher) {
    const scrollPercent = scrollPos / totalScroll;
    const startPos = windowHeight * 0.05;
    const endPos = windowHeight * 0.9;
    const currentY = startPos + scrollPercent * (endPos - startPos);
    const rotation = scrollPercent * 1080;
    sidebarClutcher.style.top = `${currentY}px`;
    sidebarClutcher.style.transform = `rotate(${rotation}deg)`;
  }

  // --- MULTI-STAGE ANIMATION ---
  const isMobile = window.innerWidth < 600;

  // Phase 1: Hand to Video
  const phase1End = windowHeight * (isMobile ? 1.5 : 1.8);
  const p1Progress = Math.min(scrollPos / phase1End, 1);

  if (p1Progress < 1) {
    // 1. Hand Scaling
    const scaleFactor = isMobile ? 0.8 : 1.5;
    const handScale = 1 + Math.pow(p1Progress, 1.2) * scaleFactor;
    const handY = p1Progress * (isMobile ? 50 : 100);
    hand.style.transform = `scale(${handScale}) translateY(${handY}px)`;

    // Blur and Unblur effect
    const handBlur = Math.sin(p1Progress * Math.PI) * (isMobile ? 4 : 6);
    const handFade = 1 - Math.sin(p1Progress * Math.PI) * 0.3;

    hand.style.filter = `blur(${handBlur}px)`;
    hand.style.opacity = handFade;

    // 2. Clutcher PNG moving to center
    const initR = window.innerWidth * (isMobile ? 0.32 : 0.14);
    const initB = window.innerWidth * (isMobile ? 0.32 : 0.094);

    // Calculate center-ish targets
    const clutcherWidth = clutcherPng.offsetWidth;
    const finalR = window.innerWidth / 2 - clutcherWidth / 2;
    const finalB = window.innerHeight * (isMobile ? 0.4 : 0.3);

    const moveX = p1Progress * (finalR - initR);
    const moveY = p1Progress * (finalB - initB);

    clutcherPng.style.right = `${initR + moveX}px`;
    clutcherPng.style.bottom = `${initB + moveY}px`;

    // Fade out earlier to avoid overlapping with video (dead by 0.7 progress)
    clutcherPng.style.opacity =
      p1Progress < 0.5 ? 1 : 1 - (p1Progress - 0.5) / 0.2;
    if (p1Progress >= 0.7) clutcherPng.style.opacity = 0;

    videoWrapper.style.opacity =
      p1Progress > 0.75 ? (p1Progress - 0.75) * 4 : 0;
  } else {
    // Phase 2: Video Blur & Disappear
    const p2Offset = scrollPos - phase1End;
    const p2Duration = windowHeight * (isMobile ? 1.2 : 1.5);
    const p2Progress = Math.min(p2Offset / p2Duration, 1);

    // Hand continues to scale but less aggressively on mobile
    const baseScale = isMobile ? 1.8 : 2.5;
    const finalScaleAdd = isMobile ? 2.5 : 4.5;
    const handScale = baseScale + p2Progress * finalScaleAdd;

    hand.style.transform = `scale(${handScale}) translateY(${
      isMobile ? 50 : 100
    }px)`;
    hand.style.opacity = 1 - p2Progress;
    hand.style.filter = `blur(${p2Progress * (isMobile ? 10 : 15)}px)`;

    clutcherPng.style.opacity = 0;

    videoWrapper.style.opacity = 1;
    clutcherVidContainer.style.filter = `blur(${
      p2Progress * (isMobile ? 15 : 20)
    }px)`;
    clutcherVidContainer.style.opacity = 1 - p2Progress * 0.5;

    const translateExtraX = isMobile ? 0 : 50;
    const liftAmount = isMobile ? 50 : 100;
    videoWrapper.style.transform = `translateX(${translateExtraX}px) translateY(calc(-50% - ${
      p2Progress * liftAmount
    }px)) scale(${1 + p2Progress * 0.2})`;
  }

  // 3. Reveal the note
  if (reveal) {
    const revealRect = reveal.getBoundingClientRect();
    if (revealRect.top < windowHeight * 0.85) {
      reveal.classList.add("visible");
    }
  }
});

// Theme Toggle Logic
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      themeIcon.src = "assets/day.png";
    } else {
      themeIcon.src = "assets/night.png";
    }
  });
}
