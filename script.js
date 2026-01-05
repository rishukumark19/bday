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

  // Phase 1: Hand to Video (0% to 40% of page scroll)
  const phase1End = windowHeight * 1.2;
  const p1Progress = Math.min(scrollPos / phase1End, 1);

  if (p1Progress < 1) {
    // 1. Hand getting bigger
    const handScale = 1 + p1Progress * 0.5;
    hand.style.transform = `scale(${handScale})`;
    hand.style.opacity = 1;

    // 2. Clutcher PNG moving to center
    // Initial: bottom: 60, right: 110
    const initR = 110;
    const initB = 60;
    const moveX = p1Progress * (window.innerWidth / 2 - initR);
    const moveY = p1Progress * (window.innerHeight * 0.3 - initB);

    clutcherPng.style.right = `${initR + moveX}px`;
    clutcherPng.style.bottom = `${initB + moveY}px`;
    clutcherPng.style.opacity = 1 - Math.pow(p1Progress, 4); // Fade out near the end

    // Video stays hidden
    videoWrapper.style.opacity = p1Progress > 0.8 ? (p1Progress - 0.8) * 5 : 0;
  } else {
    // Phase 2: Video Blur & Disappear (40% to 100%)
    const p2Offset = scrollPos - phase1End;
    const p2Progress = Math.min(p2Offset / (windowHeight * 1.5), 1);

    // Hand continues to big and then fades
    hand.style.transform = `scale(1.5)`;
    hand.style.opacity = 1 - p2Progress;

    // Clutcher PNG is gone
    clutcherPng.style.opacity = 0;

    // Video is fully visible and starts blurring
    videoWrapper.style.opacity = 1;
    clutcherVidContainer.style.filter = `blur(${p2Progress * 20}px)`;
    clutcherVidContainer.style.opacity = 1 - p2Progress * 0.5;

    // Lift the video as it blurs
    videoWrapper.style.transform = `translateY(calc(-50% - ${
      p2Progress * 100
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
