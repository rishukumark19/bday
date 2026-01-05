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

// Scroll Cue Click Handler
if (scrollCue) {
  scrollCue.addEventListener("click", () => {
    window.scrollTo({
      top: window.innerHeight * 0.5,
      behavior: "smooth",
    });
  });
}

function updateScrollAnimations() {
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

  // Phase 1: Hand to Video Transition
  const phase1End = windowHeight * (isMobile ? 1.5 : 1.8);
  const p1Progress = Math.min(scrollPos / phase1End, 1);

  if (p1Progress < 1) {
    // 1. Hand Scaling & Movement
    if (hand) {
      const scaleFactor = isMobile ? 1.2 : 2.0;
      const handScale = 1 + Math.pow(p1Progress, 1.5) * scaleFactor;
      const handY = p1Progress * (isMobile ? 150 : 300);
      const handX = p1Progress * (isMobile ? 50 : 100);

      hand.style.opacity = 1 - Math.pow(p1Progress, 2);
      hand.style.filter = `blur(${p1Progress * (isMobile ? 8 : 12)}px)`;
      // Apply transform separately to ensure rotation or other base styles don't conflict
      hand.style.transform = `scale(${handScale}) translate(${handX}px, ${handY}px)`;
    }

    // 2. Clutcher PNG moving to center
    if (clutcherPng) {
      const initR = window.innerWidth * (isMobile ? 0.32 : 0.14);
      const initB = window.innerWidth * (isMobile ? 0.32 : 0.094);
      const clutcherWidth = clutcherPng.offsetWidth || 40;

      // Target is horizontal center of screen
      const finalR = window.innerWidth / 2 - clutcherWidth / 2;
      const finalB = window.innerHeight * (isMobile ? 0.45 : 0.4);

      const moveX = p1Progress * (finalR - initR);
      const moveY = p1Progress * (finalB - initB);

      clutcherPng.style.right = `${initR + moveX}px`;
      clutcherPng.style.bottom = `${initB + moveY}px`;
      clutcherPng.style.transform = `rotate(${p1Progress * 360}deg)`;

      // Smoother fade out
      const clutcherOpacity =
        p1Progress < 0.4 ? 1 : Math.max(0, 1 - (p1Progress - 0.4) / 0.4);
      clutcherPng.style.opacity = clutcherOpacity;

      if (p1Progress >= 0.8) clutcherPng.style.opacity = 0;
    }

    if (videoWrapper) {
      // Reach full opacity by 80% of Phase 1
      const videoFadeStart = 0.5;
      const videoFadeEnd = 0.8;
      let videoOpacity = 0;

      if (p1Progress > videoFadeStart) {
        videoOpacity = Math.min(
          1,
          (p1Progress - videoFadeStart) / (videoFadeEnd - videoFadeStart)
        );
      }
      videoWrapper.style.opacity = videoOpacity;
    }
  } else {
    // Phase 2: Video Focus & Note Transition
    const p2Offset = scrollPos - phase1End;
    const p2Duration = windowHeight * (isMobile ? 1.2 : 1.5);
    const p2Progress = Math.min(p2Offset / p2Duration, 1);

    if (hand) hand.style.opacity = 0;
    if (clutcherPng) clutcherPng.style.opacity = 0;

    if (videoWrapper) {
      videoWrapper.style.opacity = 1;
      const liftAmount = isMobile ? 80 : 150;
      videoWrapper.style.transform = `translateY(calc(-50% - ${
        p2Progress * liftAmount
      }px)) scale(${1 + p2Progress * 0.3})`;
    }

    if (clutcherVidContainer) {
      // Delay blur and fade until 40% into phase 2 to keep video clear longer
      const blurStartThreshold = 0.4;
      let effectiveBlurProgress = 0;

      if (p2Progress > blurStartThreshold) {
        effectiveBlurProgress =
          (p2Progress - blurStartThreshold) / (1 - blurStartThreshold);
      }

      const blurAmount = effectiveBlurProgress * (isMobile ? 15 : 20);
      clutcherVidContainer.style.filter = `blur(${blurAmount}px)`;

      // Video should stay relatively visible until much later
      const fadeThreshold = 0.5;
      let effectiveFadeProgress = 0;
      if (p2Progress > fadeThreshold) {
        effectiveFadeProgress =
          (p2Progress - fadeThreshold) / (1 - fadeThreshold);
      }
      clutcherVidContainer.style.opacity = 1 - effectiveFadeProgress;
    }

    // Auto-play safety
    if (
      clutcherVideo &&
      clutcherVideo.paused &&
      p1Progress >= 1 &&
      p2Progress < 1
    ) {
      clutcherVideo.play().catch(() => {});
    }
  }

  // 3. Pixel Reveal & Reveal the note
  if (pixelWrapper) {
    const rect = pixelWrapper.getBoundingClientRect();
    const triggerPoint = windowHeight * 0.8;
    const endPoint = windowHeight * 0.3;

    // Calculate progress through the trigger zone
    const revealProgress = Math.min(
      Math.max((triggerPoint - rect.top) / (triggerPoint - endPoint), 0),
      1
    );

    if (pixelOverlay) {
      pixelOverlay.style.opacity = 1 - revealProgress;
    }
    if (unlockHint) {
      unlockHint.style.opacity = 0.6 * (1 - revealProgress);
    }

    if (revealProgress > 0.1 && reveal) {
      reveal.classList.add("visible");
    }
  }
}

// Listeners
window.addEventListener("scroll", updateScrollAnimations);
window.addEventListener("resize", updateScrollAnimations);

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

// Initial trigger
updateScrollAnimations();
