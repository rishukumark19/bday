const handOnTop = document.querySelector(".hand-on-top");
const clutcherContainer = document.querySelector(".clutcher-container");
const reveal = document.querySelector(".reveal");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

window.addEventListener("scroll", () => {
  const scrollPos = window.scrollY;
  const windowHeight = window.innerHeight;

  // 1. Hand Disappears quickly as you scroll
  if (handOnTop) {
    // Fade out over the first 150px of scroll
    handOnTop.style.opacity = Math.max(1 - scrollPos / 150, 0);
  }

  // 2. Clutcher transforms into background element
  if (clutcherContainer) {
    // Only start blurring after the hand is mostly gone (150px)
    // and make the blur reach its maximum much later (windowHeight * 1.5)
    const blurThreshold = 150;
    const blurProgress = Math.min(
      Math.max((scrollPos - blurThreshold) / (windowHeight * 1.5), 0),
      1
    );

    // Smooth progress for lift/scale
    const generalProgress = Math.min(scrollPos / (windowHeight * 1.5), 1);

    // Apply blur and slight fade
    clutcherContainer.style.filter = `blur(${blurProgress * 15}px)`;
    clutcherContainer.style.opacity = Math.max(1 - generalProgress * 0.4, 0.6);

    // Move slightly up and scale for "distanced" look
    const lift = generalProgress * 150;
    const scale = 1 + generalProgress * 0.2;
    clutcherContainer.style.transform = `translateY(${-lift}px) scale(${scale})`;
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
