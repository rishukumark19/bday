const hand = document.querySelector(".hand-on-top");
const clutcherPng = document.querySelector(".clutcher-png-rotating");
const videoWrapper = document.querySelector(".image-wrapper");
const clutcherVidContainer = document.querySelector(".clutcher-container");
const clutcherVideo = document.getElementById("clutcher-video");
const reveal = document.querySelector(".reveal");
const sidebarClutcher = document.getElementById("sidebar-clutcher");
const scrollCue = document.getElementById("scroll-cue");
const pixelOverlay = document.querySelector(".pixel-overlay");
const pixelWrapper = document.querySelector(".pixel-wrapper");
const unlockHint = document.querySelector(".unlock-hint");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// Scroll Cue Click Handler
if (scrollCue) {
  scrollCue.addEventListener("click", () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: "smooth",
    });
  });
}

function updateScrollAnimations() {
  const scrollPos = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  const totalScroll = docHeight - windowHeight;

  // 0. Update Sidebar Clutcher (Always runs)
  if (sidebarClutcher) {
    const scrollPercent = Math.min(Math.max(scrollPos / totalScroll, 0), 1);
    const startPos = windowHeight * 0.05;
    const endPos = windowHeight * 0.9;
    const currentY = startPos + scrollPercent * (endPos - startPos);
    sidebarClutcher.style.top = `${currentY}px`;
    sidebarClutcher.style.transform = `rotate(${scrollPercent * 1080}deg)`;
  }

  // --- GLOBAL PROGRESS CALCS ---
  const isMobile = window.innerWidth < 600;
  const animStart = windowHeight * 0.3;
  const phase1Range = windowHeight * 1.5;
  const p1Progress = Math.min(
    Math.max((scrollPos - animStart) / phase1Range, 0),
    1
  );

  // Stage 2 Progress (Video to Note)
  const p2Start = animStart + phase1Range;
  const p2Duration = windowHeight * 1.2;
  const p2Progress = Math.min(
    Math.max((scrollPos - p2Start) / p2Duration, 0),
    1
  );

  // --- STAGE 1: HERO TO SCENE ---
  if (p1Progress < 1) {
    if (hand) {
      const scaleFactor = isMobile ? 1.2 : 2.0;
      const handScale = 1 + Math.pow(p1Progress, 1.5) * scaleFactor;
      const handY = p1Progress * (isMobile ? 150 : 300);
      const handX = p1Progress * (isMobile ? 50 : 100);

      hand.style.opacity = Math.max(0, 1 - Math.pow(p1Progress, 2));
      hand.style.filter = `blur(${p1Progress * (isMobile ? 8 : 12)}px)`;
      hand.style.transform = `scale(${handScale}) translate(${handX}px, ${handY}px)`;
    }

    if (clutcherPng) {
      const initR = window.innerWidth * (isMobile ? 0.32 : 0.14);
      const initB = window.innerWidth * (isMobile ? 0.32 : 0.094);
      const clutcherWidth = clutcherPng.offsetWidth || 40;
      const finalR = window.innerWidth / 2 - clutcherWidth / 2;
      const finalB = window.innerHeight * (isMobile ? 0.45 : 0.4);

      clutcherPng.style.right = `${initR + p1Progress * (finalR - initR)}px`;
      clutcherPng.style.bottom = `${initB + p1Progress * (finalB - initB)}px`;
      clutcherPng.style.transform = `rotate(${p1Progress * 360}deg)`;
      clutcherPng.style.opacity =
        p1Progress < 0.4 ? 1 : Math.max(0, 1 - (p1Progress - 0.4) / 0.4);
      if (p1Progress >= 0.8) clutcherPng.style.opacity = 0;
    }

    if (videoWrapper) {
      const videoFadeStart = 0.6;
      const videoFadeEnd = 0.9;
      const videoOpacity =
        p1Progress > videoFadeStart
          ? Math.min(
              1,
              (p1Progress - videoFadeStart) / (videoFadeEnd - videoFadeStart)
            )
          : 0;
      videoWrapper.style.opacity = videoOpacity;
      // Ensure video position is reset if scrolling back up
      videoWrapper.style.transform = `translateY(-50%) scale(1)`;
    }
  } else {
    // Stage 2 Logic
    if (hand) hand.style.opacity = 0;
    if (clutcherPng) clutcherPng.style.opacity = 0;

    if (videoWrapper) {
      videoWrapper.style.opacity = 1;
      const liftAmount = isMobile ? 80 : 150;
      videoWrapper.style.transform = `translateY(calc(-50% - ${
        p2Progress * liftAmount
      }px)) scale(${1 + p2Progress * 0.2})`;
    }

    if (clutcherVidContainer) {
      const blurThreshold = 0.2;
      const blurVal =
        p2Progress > blurThreshold
          ? (p2Progress - blurThreshold) / (1 - blurThreshold)
          : 0;
      clutcherVidContainer.style.filter = `blur(${blurVal * 20}px)`;
      clutcherVidContainer.style.opacity = 1 - blurVal;
    }

    if (clutcherVideo && clutcherVideo.paused && p2Progress < 1) {
      clutcherVideo.play().catch(() => {});
    }
  }

  // --- STAGE 3: PIXEL REVEAL ---
  if (pixelWrapper) {
    const rect = pixelWrapper.getBoundingClientRect();
    const trigger = windowHeight * 0.9; // Start reveal a bit earlier
    const finish = windowHeight * 0.3; // Fully clear by here

    const revealProgress = Math.min(
      Math.max((trigger - rect.top) / (trigger - finish), 0),
      1
    );

    if (pixelOverlay) {
      pixelOverlay.style.opacity = 1 - revealProgress;
      // Gradually reduce blur to 0
      const currentBlur = 20 * (1 - revealProgress);
      pixelOverlay.style.backdropFilter = `blur(${currentBlur}px) contrast(0.7)`;
    }

    if (unlockHint) {
      unlockHint.style.opacity = 0.6 * (1 - revealProgress);
      // Fixed: p2Progress is now defined globally in this function
      unlockHint.style.transform = `translateY(${-p2Progress * 30}px)`;
    }

    // Safety: ensure message is visible if unlocked
    if (revealProgress > 0.01 && reveal) {
      reveal.classList.add("visible");
    }
  }
}

// Event Listeners
window.addEventListener("scroll", updateScrollAnimations);
window.addEventListener("resize", updateScrollAnimations);
document.addEventListener("DOMContentLoaded", updateScrollAnimations);

// Theme Toggle
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (themeIcon) {
      themeIcon.src = document.body.classList.contains("dark-mode")
        ? "assets/day.png"
        : "assets/night.png";
    }
  });
}

// Initial Kickoff
updateScrollAnimations();
