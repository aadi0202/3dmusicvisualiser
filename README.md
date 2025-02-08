🎵 Music Visualizer with Three.js

This project is a music visualizer built using Three.js, where an interactive 3D sphere responds to audio frequencies from an uploaded audio file. The visualization dynamically distorts the sphere and changes its color based on the sound.

🚀 Features
	•	Audio File Upload: Choose any .mp3 or audio file to visualize.
	•	3D Sphere Visualization: A dynamic sphere reacts to audio frequencies.
	•	Color Changes: Sphere color adjusts based on the audio frequency intensity.
	•	Smooth Rotation: Sphere rotates continuously for a better visual effect.
	•	Responsive Design: Adapts to different screen sizes.

📂 Project Structure

music-visualizer/
│-- index.html        # Main HTML file
│-- script.js         # JavaScript logic for Three.js and audio processing
│-- styles.css        # CSS styles for the project
│-- README.md         # Project documentation (this file)

🛠️ Technologies Used
	•	Three.js: 3D graphics rendering
	•	JavaScript: Core programming logic
	•	HTML5: Page structure
	•	CSS3: Styling

📖 Usage Instructions
1.	Clone the Repository:

git clone https://github.com/aadi0202/3dmusicvisualiser.git


	2.	Navigate to the Project Directory:

cd music-visualizer


	3.	Open the index.html File in a Web Browser.
	4.	Upload an MP3 File:
	•	Click on the “Choose File” button to upload your audio.
	•	The 3D sphere will start visualizing the music.

🎨 Visual Effects
	•	The sphere expands and contracts based on the sound frequency.
	•	Color changes based on the highest detected frequency.
	•	Continuous rotation enhances the visual appeal.

📷 Screenshots
<img width="1453" alt="image" src="https://github.com/user-attachments/assets/fdb9dc42-7d28-4b8a-9b59-8df48e84216c" />



⚙️ Customization

You can modify the following parts of the project:
	•	Sphere Size: Change the sphere geometry in script.js:

const geometry = new THREE.SphereGeometry(5, 64, 64);


	•	Background Color: Modify the scene background color in script.js:

scene.background = new THREE.Color(0xffffff);


	•	Rotation Speed: Adjust rotation speed in the animate() function:

sphere.rotation.x += 0.01;
sphere.rotation.y += 0.01;

🐞 Troubleshooting
	•	Ensure that your web browser supports Web Audio API and WebGL.
	•	If the audio file does not play, check the browser permissions for audio playback.
	•	Clear your browser cache and try reloading the page.

🤝 Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue for suggestions.
	1.	Fork the project
	2.	Create your feature branch (git checkout -b feature-name)
	3.	Commit your changes (git commit -m 'Add new feature')
	4.	Push to the branch (git push origin feature-name)
	5.	Open a Pull Request

📜 License

This project is licensed under the MIT License – feel free to modify and distribute.

📧 Contact

For any queries or suggestions, feel free to reach out:
	•	GitHub: aadi0202
	•	Email: aadipunatar@gmail.com

Enjoy visualizing your music! 🎧✨
