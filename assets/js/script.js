// Audio Context for alarm
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playAlarm() {
  const duration = 2;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.2);
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.4);
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.6);
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.8);
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 1.0);
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 1.2);
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 1.4);

  oscillator.type = "square";
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + duration
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

// Countdown Logic
const countdownSection = document.getElementById("countdownSection");
const countdownNumber = document.getElementById("countdownNumber");
const spaceContainer = document.getElementById("spaceContainer");
const errorSection = document.getElementById("errorSection");
const ctaButton = document.getElementById("ctaButton");

let count = 3;

function countdown() {
  if (count >= 1) {
    countdownNumber.textContent = count.toString();
    count--;
    setTimeout(countdown, 1000);
  } else {
    countdownNumber.classList.add("fade-out");
    setTimeout(() => {
      countdownSection.classList.add("hidden");
      spaceContainer.classList.add("active");
      setTimeout(() => {
        countdownSection.style.display = "none";
      }, 500);
    }, 500);
  }
}

setTimeout(countdown, 500);

// Generate stars
const starsBg = document.getElementById("starsBg");
for (let i = 0; i < 200; i++) {
  const star = document.createElement("div");
  star.className = "star";
  star.style.left = Math.random() * 100 + "%";
  star.style.top = Math.random() * 100 + "%";
  star.style.animationDelay = Math.random() * 3 + "s";
  starsBg.appendChild(star);
}

// Space objects setup
const spaceScene = document.getElementById("spaceScene");
const objects = [];

// Create 5 planets in order: Sol, Venus, Jupiter, Urano, Tierra
const planetTypes = ["sol", "venus", "jupiter", "urano", "tierra"];
const planetSizes = [200, 120, 180, 140, 130];

for (let i = 0; i < 5; i++) {
  const planet = document.createElement("div");
  planet.className = `space-object planet ${planetTypes[i]}`;
  const size = planetSizes[i];
  planet.style.width = size + "px";
  planet.style.height = size + "px";
  spaceScene.appendChild(planet);

  objects.push({
    element: planet,
    z: -1000 - i * 1500,
    x: (Math.random() - 0.5) * 600,
    y: (Math.random() - 0.5) * 400,
    speed: 0.6 + Math.random() * 0.3,
  });
}

let scrollProgress = 0;
let scrolling = false;

function updateSpaceScene() {
  objects.forEach((obj) => {
    const z = obj.z + scrollProgress * obj.speed * 2;

    if (z > 500) {
      obj.z = -5000;
    }

    const scale = 1000 / (1000 - z);
    const x = obj.x * scale;
    const y = obj.y * scale;
    const opacity = Math.max(0, Math.min(1, (z + 4000) / 4000));

    obj.element.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${Math.max(
      0.1,
      scale
    )})`;
    obj.element.style.opacity = opacity;
  });

  // Previously the error section was shown as a fixed overlay when the
  // journey reached a certain scrollProgress. We no longer force an overlay
  // here so the error section can appear naturally at the end of the page
  // as part of the document flow.
}

window.addEventListener("scroll", () => {
  scrollProgress = window.scrollY;
  if (!scrolling) {
    scrolling = true;
    requestAnimationFrame(() => {
      updateSpaceScene();
      scrolling = false;
    });
  }
});

// Initial render
updateSpaceScene();

// Button handler: scroll smoothly to the top of the page (back to 'Earth')
ctaButton.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
