const audioElements = [];
for (let i = 0; i < 1000; i++) {
    const audioContext = new AudioContext();

    const audioElement = document.createElement("audio");
    audioElement.setAttribute("src", "samples/threeNotes.mp3");
    document.body.appendChild(audioElement);
    const gainNode = audioContext.createGain();

    const pannerOptions = { pan: 0 };
    const panner = new StereoPannerNode(audioContext, pannerOptions);

    const track = audioContext.createMediaElementSource(audioElement);
    track.connect(gainNode).connect(panner).connect(audioContext.destination);

    gainNode.gain.value = 1 + Math.random() * 4;
    audioElements.push(audioElement);
}
const playButton = document.getElementById("play-button");
playButton.addEventListener("click", () => {
    for (const audioElement of audioElements) {
        console.log(audioElement);
        setTimeout(() => audioElement.play(), Math.random() * 1000);
    }
});

const fileInput = document.getElementById("file-input");

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const fileURL = URL.createObjectURL(file);
    console.log(fileURL);
    for (const audioElement of audioElements) audioElement.src = fileURL;
    // audioElement.src = fileURL;
});
