// Initialize Three.js scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // Set white background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a sphere geometry
const geometry = new THREE.SphereGeometry(5, 64, 64);
const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Position the camera
camera.position.z = 15;

// Audio file selection and processing
const audioInput = document.getElementById("audioFile");
const audioElement = document.getElementById("audio");

audioInput.addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    const objectURL = URL.createObjectURL(file);
    audioElement.src = objectURL;
    audioElement.play();

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioSource = audioContext.createMediaElementSource(audioElement);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    const frequencyData = new Uint8Array(analyser.frequencyBinCount);

    function animate() {
      requestAnimationFrame(animate);

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

    audioElement.onplay = () => audioContext.resume();
    animate();
  }
});