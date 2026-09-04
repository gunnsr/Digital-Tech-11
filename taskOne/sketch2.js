// ===================================================
// STUDENT TASK: Build a graphical dashboard for Seneye
// ===================================================

// Replace this with your teacher's Cloudflare Worker URL:
const PROXY_URL = "https://seneye-proxy.ezankov.workers.dev/";

// Toggle to true if you are working offline without network access
const USE_OFFLINE_MOCK = false;

let aquariumData = null;
let lastUpdated = "";
let water;

function preload() {
  // Load initial data before setup() runs
  let endpoint = USE_OFFLINE_MOCK ? "sample-data.json" : PROXY_URL;
  aquariumData = loadJSON(endpoint, onDataLoaded, onError);
  water = loadImage('fish.gif'); 
}

function setup() {
  createCanvas(800, 500);
  
  // Refresh live data every 5 minutes (300,000 ms)
  if (!USE_OFFLINE_MOCK) {
    setInterval(() => {
      loadJSON(PROXY_URL, onDataLoaded, onError);
    }, 300000);
  }
}

function onDataLoaded(data) {
  aquariumData = data;
  lastUpdated = new Date().toLocaleTimeString();
  console.log("Data refreshed successfully:", data);
}

function onError(err) {
  console.error("Failed to load aquarium data. Check proxy URL or network.", err);
}

function draw() {
  background(water);  // Dark blue aquarium background

  // 1. Draw Title Header with Color-Changing Background
  push();
  colorMode(HSB, 360, 100, 100);
  let currentHue = frameCount % 360;
  noStroke();
  fill(currentHue, 70, 80);
  rect(100, 20, 335, 35, 8); // Shifted right slightly to give the top-left fish room
  colorMode(RGB, 255);
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Fish Environment Dashboard", 105, 25);
  pop();

  textAlign(LEFT, BASELINE);

  // Display connection status
  textSize(12);
  fill(150, 200, 255);
  text("Last updated: " + (lastUpdated || "Loading..."), 105, 75);

  // 2. Render Dashboard Graphics
  if (aquariumData) {
    // NOTE: Update these keys based on your actual Seneye JSON response structure!
    let temp = aquariumData[0].exps.temperature.curr;
    let temp2 = aquariumData[0].exps.temperature.avg;
    let ph = aquariumData[0].exps.ph.curr;
    let ph2 = aquariumData[0].exps.ph.avg;
    let nh3 = aquariumData[0].exps.nh3.curr;
    let nh3two = aquariumData[0].exps.nh3.avg;
  
    // Call your custom graphic widgets
    drawTempWidget(50, 120, temp, temp2);
    drawGauge2Widget(300, 120, "pH Level", ph, ph2);
    drawGaugeWidget(550, 120, "Ammonia (NH3)", nh3, nh3two);

    if (ph <= 6.5 || ph >= 8.2) {
      textSize(24);
      fill(255, 116, 108);
      textAlign(RIGHT, BOTTOM);
      text("SAVE THE FISH", 480, 305);
    }
    if (temp <= 20.00 || temp >= 28.00) {
      textSize(24);
      fill(255, 116, 108);
      textAlign(RIGHT, BOTTOM);
      text("SAVE THE FISH", 480, 305);
    }
    if (nh3 >= 0.05) {
      textSize(24);
      fill(255, 116, 108);
      textAlign(RIGHT, BOTTOM);
      text("SAVE THE FISH", 480, 305);
    }
  }

  // 3. Draw Fish in Each Corner
  drawFish(50, 35, 0.5);    // Top-Left Corner (Small fish, scale: 0.5)
  drawFish(730, 40, 1.0);   // Top-Right Corner
  drawFish(60, 440, 1.0);   // Bottom-Left Corner
  drawFish(730, 440, 1.0);  // Bottom-Right Corner
}

// Example Widget Function: Temperature Card
function drawTempWidget(x, y, tempVal, temp2Val) {
  fill(35, 48, 68);
  stroke(60, 80, 110);
  rect(x, y, 200, 150, 10);

  noStroke();
  fill(255, 255, 255);
  textSize(14);
  text("Water Temp", x + 15, y + 15);

  fill(173, 216, 230);
  textSize(36);
  text(tempVal + "°C", x + 15, y + 50);

  fill(255, 192, 203);
  textSize(14);
  text("Average: " + temp2Val + "°C", x + 15, y + 100);
}

// Example Widget Function: Simple Bar Gauge (pH)
function drawGauge2Widget(x, y, label, val, ph2) {
  fill(35, 48, 68);
  stroke(60, 80, 110);
  rect(x, y, 200, 150, 10);

  noStroke();
  fill(255, 255, 255);
  textSize(14);
  text(label, x + 15, y + 15);

  fill(173, 216, 230);
  textSize(28);
  text(val, x + 15, y + 50);

  fill(255, 192, 203);
  textSize(16);
  text("Average: " + ph2, x + 15, y + 100);
}

// Example Widget Function: Simple Bar Gauge (Ammonia)
function drawGaugeWidget(x, y, label, val, nh3two) {
  fill(35, 48, 68);
  stroke(60, 80, 110);
  rect(x, y, 200, 150, 10);

  noStroke();
  fill(255, 255, 255);
  textSize(14);
  text(label, x + 15, y + 15);

  fill(173, 216, 230);
  textSize(28);
  text(val, x + 15, y + 50);

  fill(255, 192, 203);
  textSize(16);
  text("Average: " + nh3two, x + 15, y + 100);
}

// Custom Fish Graphic (Supports dynamic position and scale)
function drawFish(x, y, s = 1.0) {
  push();
  translate(x, y);
  scale(s); // Adjusts the size of the fish (e.g., 0.5 makes it 50% size)

  // Tail Fin
  fill(255, 120, 80);
  noStroke();
  triangle(30, 0, 60, -20, 60, 20);

  // Body
  fill(255, 150, 100);
  ellipse(0, 0, 80, 50);

  // Eye
  fill(255);
  circle(-20, -5, 12);
  fill(0);
  circle(-22, -5, 5);

  // Side Fin
  fill(255, 120, 80);
  triangle(0, 5, 15, -5, 10, 15);

  pop();
}