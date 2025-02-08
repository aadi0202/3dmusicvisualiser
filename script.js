// Initialize Three.js scene
let audioContext = null;
let analyser = null;
let currentAudioSource = null;
let mediaStream = null;
let isMicActive = false;
let frequencyData = null;
let audioFileSource = null; // New variable to hold the MediaElementAudioSourceNode

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Set black background

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a glowing sphere
const geometry = new THREE.SphereGeometry(5, 64, 64);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Position the camera
camera.position.z = 15;

// Get audio elements
const audioInput = document.getElementById("audioFile");
const audioElement = document.getElementById("audio");
const micButton = document.getElementById("micButton");

// Load default audio when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Ensure an AudioContext is created
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  audioElement
    .play()
    .then(() => {
      if (!audioFileSource) {
        audioFileSource = audioContext.createMediaElementSource(audioElement);
      }
      setupAudioProcessing(audioFileSource);
    })
    .catch((error) => {
      console.error("Audio play error:", error);
    });
});

// Handle file upload
audioInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    // If mic is active, stop it and update UI accordingly
    if (isMicActive) {
      mediaStream.getTracks().forEach((track) => track.stop());
      mediaStream = null;
      isMicActive = false;
      micButton.classList.remove("active");
      micButton.textContent = "Use Microphone";
      audioElement.style.display = "block";
    }

    const objectURL = URL.createObjectURL(file);
    audioElement.src = objectURL;
    audioElement
      .play()
      .then(() => {
        if (!audioFileSource) {
          audioFileSource = audioContext.createMediaElementSource(audioElement);
        }
        setupAudioProcessing(audioFileSource);
      })
      .catch((error) => {
        console.error("Audio play error:", error);
      });
  }
});

function setupAudioProcessing(source, isMic = false) {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  // Cleanup previous connections
  if (currentAudioSource) {
    try {
      currentAudioSource.disconnect();
    } catch (e) {
      console.warn("Error disconnecting previous source:", e);
    }
  }
  if (analyser) {
    try {
      analyser.disconnect();
    } catch (e) {
      console.warn("Error disconnecting analyser:", e);
    }
  }

  analyser = audioContext.createAnalyser();
  analyser.fftSize = 128;
  frequencyData = new Uint8Array(analyser.frequencyBinCount);

  if (source) {
    currentAudioSource = source;
    currentAudioSource.connect(analyser);
    // Only connect to destination for non-microphone sources
    if (!isMic) {
      analyser.connect(audioContext.destination);
    }
  }

  // Resume the AudioContext if it is suspended
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

// Mic button handler
micButton.addEventListener("click", async () => {
  try {
    // Ensure AudioContext exists
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (!isMicActive) {
      // Activate microphone: pause and hide the audio player, change button text
      audioElement.pause();
      audioElement.style.display = "none";
      micButton.textContent = "Stop Microphone";

      // Get microphone stream
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      isMicActive = true;
      micButton.classList.add("active");

      const micSource = audioContext.createMediaStreamSource(mediaStream);
      setupAudioProcessing(micSource, true);
    } else {
      // Deactivate microphone: stop microphone stream and update UI
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      mediaStream = null;
      isMicActive = false;
      micButton.classList.remove("active");
      micButton.textContent = "Use Microphone";
      audioElement.style.display = "block";

      // Resume audio file processing
      if (!audioFileSource) {
        audioFileSource = audioContext.createMediaElementSource(audioElement);
      }
      setupAudioProcessing(audioFileSource);
      audioElement.play().catch((error) => {
        console.error("Audio play error:", error);
      });
    }
  } catch (error) {
    console.error("Error accessing microphone:", error);
  }
});

function animate() {
  requestAnimationFrame(animate);

  if (!analyser || !frequencyData) return;

  analyser.getByteFrequencyData(frequencyData);
  const vertices = geometry.attributes.position.array;
  let maxFrequency = 0;

  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const z = vertices[i + 2];

    const distance = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
    const freqIndex = Math.floor((i / 3) % frequencyData.length);
    const scale = 1 + frequencyData[freqIndex] / 512;
    maxFrequency = Math.max(maxFrequency, frequencyData[freqIndex]);

    vertices[i] = (x / distance) * scale * 5;
    vertices[i + 1] = (y / distance) * scale * 5;
    vertices[i + 2] = (z / distance) * scale * 5;
  }

  geometry.attributes.position.needsUpdate = true;
  const colorIntensity = Math.floor((maxFrequency / 256) * 255);
  material.color.set(`rgb(${colorIntensity}, ${255 - colorIntensity}, 255)`);

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;
  renderer.render(scene, camera);
}

// Start animation loop
animate();

// Handle audio context resume on play
audioElement.onplay = () => {
  if (audioContext) {
    audioContext.resume();
  }
};

// Handle window resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
