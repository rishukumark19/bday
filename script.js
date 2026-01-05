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
const cursorCat = document.getElementById("cursor-cat");
const pixelRevealBtn = document.getElementById("pixel-reveal-btn");

// --- QUIZ DATA ---
const quizData = [
  {
    title: "Pick one!",
    type: "comparison",
    left: "Idli",
    right: "Dosa",
    symbols: ["<", ">"],
  },
  {
    title: "The sweeter choice?",
    type: "comparison",
    left: "Tiramisu",
    right: "Gadbad",
    symbols: ["<", ">"],
  },
  {
    title: "Ghee or Sukka?",
    type: "comparison",
    left: "Chicken Ghee Roast",
    right: "Chicken Sukka",
    symbols: ["<", ">"],
  },
];

let currentQuizStep = 0;
const quizContainer = document.getElementById("quiz-container");
const quizOptions = document.getElementById("quiz-options");
const quizTitle = document.getElementById("quiz-question-title");
const quizDots = document.getElementById("quiz-step-dots");
const scrollToggleBtn = document.getElementById("scroll-toggle");

function showQuizStep(step) {
  if (step >= quizData.length) {
    revealNoteFinal();
    return;
  }

  const data = quizData[step];
  quizTitle.textContent = data.title;
  quizOptions.innerHTML = "";

  // Progress Dots
  quizDots.innerHTML = quizData
    .map((_, i) => `<span class="dot ${i === step ? "active" : ""}"></span>`)
    .join("");

  if (data.type === "comparison") {
    const row = document.createElement("div");
    row.className = "quiz-row";
    row.innerHTML = `
      <span>${data.left}</span>
      <button class="quiz-btn symbol">${data.symbols[0]}</button>
      <button class="quiz-btn symbol">${data.symbols[1]}</button>
      <span>${data.right}</span>
    `;
    quizOptions.appendChild(row);
  } else {
    data.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "quiz-btn";
      btn.textContent = opt;
      quizOptions.appendChild(btn);
    });
  }

  // Add click listeners to all buttons in this step
  quizOptions.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentQuizStep++;
      quizOptions.style.opacity = "0";
      setTimeout(() => {
        quizOptions.style.opacity = "1";
        showQuizStep(currentQuizStep);
      }, 300);
    });
  });
}

const closedScroll = document.getElementById("closed-scroll");
const closeScrollBtn = document.getElementById("close-scroll-btn");

function revealNoteFinal() {
  const noteSection = pixelRevealBtn.closest(".note");
  if (quizContainer) quizContainer.style.display = "none";
  if (noteSection) noteSection.classList.add("expanded");

  if (pixelOverlay) {
    pixelOverlay.classList.add("active");
    setTimeout(() => {
      pixelOverlay.style.opacity = "0";
      pixelOverlay.style.pointerEvents = "none";
    }, 50);
  }

  // Show the visual closed scroll icon
  if (closedScroll) {
    closedScroll.style.display = "flex";
    closedScroll.style.opacity = "1";
  }
}

// Closed Scroll Click Logic (The actual reveal)
if (closedScroll) {
  closedScroll.addEventListener("click", () => {
    if (reveal) {
      reveal.style.display = "block";
      setTimeout(() => {
        reveal.classList.add("visible");
        // Hide the closed icon once unrolled
        closedScroll.style.opacity = "0";
        setTimeout(() => {
          closedScroll.style.display = "none";
        }, 500);
      }, 50);
    }
  });
}

// Close Letter Logic
if (closeScrollBtn) {
  closeScrollBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (reveal) {
      reveal.classList.remove("visible");
      setTimeout(() => {
        reveal.style.display = "none";
        // Bring back the closed scroll icon
        if (closedScroll) {
          closedScroll.style.display = "flex";
          closedScroll.style.opacity = "1";
        }
        const noteSection = pixelRevealBtn.closest(".note");
        if (noteSection) noteSection.classList.remove("expanded");
      }, 1500); // Match CSS transition
    }
  });
}

// Memory Chest Reveal Logic
if (pixelRevealBtn) {
  pixelRevealBtn.addEventListener("click", () => {
    // Fade out and remove the chest
    pixelRevealBtn.style.opacity = "0";
    pixelRevealBtn.style.transform = "scale(0.5)";
    setTimeout(() => {
      pixelRevealBtn.style.display = "none";
      // Start Quiz instead of direct reveal
      if (quizContainer) {
        quizContainer.style.display = "block";
        showQuizStep(0);
      }
    }, 600);
  });
}

// Cursor Labubu Logic
let mouseX = 0;
let mouseY = 0;
let catX = 0;
let catY = 0;
let isMoving = false;
let moveTimeout;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Detect movement for "walking"
  isMoving = true;
  if (cursorCat) cursorCat.classList.add("walking");

  clearTimeout(moveTimeout);
  moveTimeout = setTimeout(() => {
    isMoving = false;
    if (cursorCat) cursorCat.classList.remove("walking");
  }, 150);
});

function animateCat() {
  const dx = mouseX - catX;
  const dy = mouseY - catY;

  // Smoother follow
  catX += dx * 0.08;
  catY += dy * 0.08;

  if (cursorCat) {
    cursorCat.style.left = `${catX}px`;
    cursorCat.style.top = `${catY}px`;

    // Flip based on direction
    if (Math.abs(dx) > 1) {
      // If moving right (dx > 0), flip horizontally if your image points left by default
      // Usually, images point right. If labubu points left, scaleX(-1) if moving right.
      cursorCat.style.transform = `translate(-50%, -50%) scaleX(${
        dx > 0 ? -1 : 1
      })`;
    }
  }

  requestAnimationFrame(animateCat);
}
animateCat();

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

  // --- STAGE 3: NO AUTO-REVEAL ---
}

// Event Listeners
window.addEventListener("scroll", updateScrollAnimations);
window.addEventListener("resize", updateScrollAnimations);
document.addEventListener("DOMContentLoaded", updateScrollAnimations);

const bdayMusic = document.getElementById("bday-music");
let musicStarted = false;

// Theme Toggle & Music Logic
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    // 1. Theme Toggle
    document.body.classList.toggle("dark-mode");
    if (themeIcon) {
      themeIcon.src = document.body.classList.contains("dark-mode")
        ? "assets/day.png"
        : "assets/night.png";
    }

    // 2. Music Logic
    if (bdayMusic) {
      if (!musicStarted) {
        bdayMusic.play().catch(() => {
          console.log("Autoplay blocked, waiting for manual interaction.");
        });
        musicStarted = true;
      } else {
        // Toggle Mute/Unmute
        bdayMusic.muted = !bdayMusic.muted;
      }
    }
  });
}

// Initial Kickoff
updateScrollAnimations();

// --- PRIVATE GALLERY LOCK ---
const dialButtons = document.querySelectorAll(".dial.soft button");
const phoneScreen = document.getElementById("screen-text");
const privateGallery = document.getElementById("private-gallery");
const keypadWrap = document.querySelector(".keypad-wrap");
const lockedSlideshow = document.getElementById("locked-slideshow");

let dialInput = "";
const DIAL_PASSWORD = "772562";

// 1. Slideshow Logic (Locked State)
let currentSlide = 0;
const slides = document.querySelectorAll(".memory-slideshow .slide");

function rotateSlides() {
  if (slides.length === 0) return;
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
}

let slideInterval = setInterval(rotateSlides, 3000);

// 2. Dial Logic
if (dialButtons.length > 0) {
  dialButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      dialInput += btn.dataset.key;
      if (phoneScreen)
        phoneScreen.textContent = "••••••".slice(0, dialInput.length);

      if (dialInput.length === DIAL_PASSWORD.length) {
        if (dialInput === DIAL_PASSWORD) {
          if (phoneScreen) phoneScreen.textContent = "open";

          clearInterval(slideInterval);

          const galleryToggleBtn = document.getElementById("gallery-toggle");
          const giftToggleBtn = document.getElementById("gift-toggle");
          const giftSection = document.getElementById("gift-section");

          if (galleryToggleBtn) {
            galleryToggleBtn.classList.remove("hidden");
            galleryToggleBtn.textContent = "Show Gallery 🔓";
          }
          if (giftToggleBtn) {
            giftToggleBtn.classList.remove("hidden");
            giftToggleBtn.textContent = "Open Gift 🎁";
          }

          if (lockedSlideshow) {
            lockedSlideshow.style.opacity = "0";
            setTimeout(() => {
              lockedSlideshow.style.display = "none";
            }, 1000);
          }
          if (keypadWrap) {
            keypadWrap.style.opacity = "0";
            setTimeout(() => {
              keypadWrap.style.display = "none";
            }, 1000);
          }

          // Gallery Toggle Logic
          if (galleryToggleBtn) {
            galleryToggleBtn.addEventListener("click", () => {
              if (privateGallery) {
                const isHidden = privateGallery.classList.contains("hidden");
                if (isHidden) {
                  privateGallery.classList.remove("hidden");
                  galleryToggleBtn.textContent = "Hide Gallery 🔒";
                } else {
                  privateGallery.classList.add("hidden");
                  galleryToggleBtn.textContent = "Show Gallery 🔓";
                }
              }
            });
          }

          // Gift Toggle Logic
          const mathQuizContainer = document.getElementById(
            "math-quiz-container"
          );
          const mathQuestionText =
            document.getElementById("math-question-text");
          const mathOptionsContainer = document.getElementById("math-options");

          if (giftToggleBtn) {
            giftToggleBtn.addEventListener("click", () => {
              if (giftSection) {
                const isHidden = giftSection.classList.contains("hidden");
                if (isHidden) {
                  // Show Math MCQ instead of prompt
                  generateMathMCQ();
                  if (mathQuizContainer)
                    mathQuizContainer.style.display = "block";
                } else {
                  giftSection.classList.add("hidden");
                  giftToggleBtn.textContent = "Open Gift 🎁";
                }
              }
            });
          }

          function generateMathMCQ() {
            const ops = ["+", "-", "*"]; // Using multiplication instead of division for MCQ fun
            const op = ops[Math.floor(Math.random() * ops.length)];
            let a, b, expected;

            if (op === "+") {
              a = Math.floor(Math.random() * 40) + 10;
              b = Math.floor(Math.random() * 40) + 10;
              expected = a + b;
            } else if (op === "-") {
              a = Math.floor(Math.random() * 50) + 50;
              b = Math.floor(Math.random() * 40) + 10;
              expected = a - b;
            } else {
              a = Math.floor(Math.random() * 10) + 2;
              b = Math.floor(Math.random() * 12) + 2;
              expected = a * b;
            }

            if (mathQuestionText) {
              mathQuestionText.textContent = `What is ${a} ${
                op === "*" ? "×" : op
              } ${b}?`;
            }

            // Generate Options
            const options = new Set();
            options.add(expected);
            while (options.size < 4) {
              const wrong = expected + (Math.floor(Math.random() * 20) - 10);
              if (wrong !== expected && wrong > 0) options.add(wrong);
            }

            const shuffledOptions = Array.from(options).sort(
              () => Math.random() - 0.5
            );

            if (mathOptionsContainer) {
              mathOptionsContainer.innerHTML = "";
              shuffledOptions.forEach((opt) => {
                const btn = document.createElement("button");
                btn.className = "quiz-btn";
                btn.textContent = opt;
                btn.addEventListener("click", () => {
                  if (opt === expected) {
                    if (mathQuizContainer)
                      mathQuizContainer.style.display = "none";
                    if (giftSection) giftSection.classList.remove("hidden");
                    if (giftToggleBtn)
                      giftToggleBtn.textContent = "Close Gift 🔒";
                  } else {
                    alert("Not quite right! Try again. 🧠");
                    generateMathMCQ(); // Shuffle again on fail
                  }
                });
                mathOptionsContainer.appendChild(btn);
              });
            }
          }
        } else {
          if (phoneScreen) phoneScreen.textContent = "try again";
          dialInput = "";
          setTimeout(() => {
            if (phoneScreen) phoneScreen.textContent = "enter password";
          }, 1000);
        }
      }
    });
  });
}
// --- GLOBAL CLICK EFFECTS (Sound & Popper) ---
const clickSound = document.getElementById("click-sound");

document.addEventListener("click", (e) => {
  // 1. Play Click Sound
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  }

  // 2. Create Popper Burst
  createPopper(e.clientX, e.clientY);
});

function createPopper(x, y) {
  const colors = [
    "#ff595e",
    "#ffca3a",
    "#8ac926",
    "#1982c4",
    "#6a4c93",
    "#ff924c",
  ];
  const fragmentCount = 12;

  for (let i = 0; i < fragmentCount; i++) {
    const fragment = document.createElement("div");
    fragment.className = "popper-fragment";

    // Random appearance
    const color = colors[Math.floor(Math.random() * colors.length)];
    fragment.style.backgroundColor = color;

    // Position at click
    fragment.style.left = `${x}px`;
    fragment.style.top = `${y}px`;

    // Random trajectory
    const tx = (Math.random() - 0.5) * 200;
    const ty = (Math.random() - 0.5) * 200;
    fragment.style.setProperty("--tx", `${tx}px`);
    fragment.style.setProperty("--ty", `${ty}px`);

    document.body.appendChild(fragment);

    // Clean up
    setTimeout(() => {
      fragment.remove();
    }, 800);
  }
}
