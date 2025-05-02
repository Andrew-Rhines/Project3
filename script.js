// script.js

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Create nodes
const osc = audioCtx.createOscillator();           // Main oscillator
const lfo = audioCtx.createOscillator();           // LFO for flanger
const lfoGain = audioCtx.createGain();             // Modulation depth
const delayNode = audioCtx.createDelay();          // Flanger delay line
const feedback = audioCtx.createGain();            // Feedback loop
const masterGain = audioCtx.createGain();          // Output volume

// Configure nodes
osc.type = "sawtooth";
osc.frequency.setValueAtTime(220, audioCtx.currentTime);
osc.start();

lfo.type = "sine";
lfo.frequency.setValueAtTime(0.25, audioCtx.currentTime);
lfoGain.gain.value = 0.005;
lfo.connect(lfoGain);
lfoGain.connect(delayNode.delayTime);
lfo.start();

delayNode.delayTime.value = 0.005;
feedback.gain.value = 0.5;
masterGain.gain.value = 0.8;

// Connect graph
osc.connect(delayNode);
delayNode.connect(feedback);
feedback.connect(delayNode);
delayNode.connect(masterGain);
masterGain.connect(audioCtx.destination);

// UI elements
const startBtn = document.getElementById("startBtn");
const feedbackSlider = document.getElementById("feedbackGain");
const gainSlider = document.getElementById("masterGain");
const lfoRateSlider = document.getElementById("lfoRate");
const lfoDepthSlider = document.getElementById("lfoDepth");
const oscTypeSelect = document.getElementById("oscType");

const feedbackValText = document.getElementById("feedbackVal");
const gainValText = document.getElementById("gainVal");
const lfoRateVal = document.getElementById("lfoRateVal");
const lfoDepthVal = document.getElementById("lfoDepthVal");

// Audio context resume
startBtn.addEventListener("click", () => {
  audioCtx.resume().then(() => {
    console.log("AudioContext resumed");
  });
});

// Real-time parameter updates
feedbackSlider.addEventListener("input", () => {
  const val = parseFloat(feedbackSlider.value);
  feedback.gain.linearRampToValueAtTime(val, audioCtx.currentTime + 0.05);
  feedbackValText.textContent = val.toFixed(2);
});

gainSlider.addEventListener("input", () => {
  const val = parseFloat(gainSlider.value);
  masterGain.gain.linearRampToValueAtTime(val, audioCtx.currentTime + 0.05);
  gainValText.textContent = val.toFixed(2);
});

lfoRateSlider.addEventListener("input", () => {
  const val = parseFloat(lfoRateSlider.value);
  lfo.frequency.linearRampToValueAtTime(val, audioCtx.currentTime + 0.05);
  lfoRateVal.textContent = val.toFixed(2);
});

lfoDepthSlider.addEventListener("input", () => {
  const val = parseFloat(lfoDepthSlider.value);
  lfoGain.gain.linearRampToValueAtTime(val, audioCtx.currentTime + 0.05);
  lfoDepthVal.textContent = val.toFixed(3);
});

oscTypeSelect.addEventListener("change", () => {
  osc.type = oscTypeSelect.value;
});
