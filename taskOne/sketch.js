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

  // 1. Draw Title Header
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Fish Environment Dashboard", 30, 30);

  // Display connection status
  textSize(12);
  fill(150, 200, 255);
  text("Last updated: " + (lastUpdated || "Loading..."), 30, 65);


  // 2. Render Dashboard Graphics3
  if (aquariumData) {
    // NOTE: Update these keys based on your actual Seneye JSON response structure!
    // Example fields commonly found in sensor data:
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
    if(ph >= 8)
    {
    textSize(24);
    fill(255, 116, 108)
    textAlign(RIGHT,BOTTOM)
    text("SAVE THE FISH", 480, 305);
    }
  
  }
}
// Example Widget Function: Temperature Card
function drawTempWidget(x, y, tempVal, temp2Val) {
  // Background Card
fill(35, 48, 68);
stroke(60, 80, 110);
rect(x, y, 200, 150, 10);

  // Label
  noStroke();
  fill(255, 255, 255);
  textSize(14);
  text("Water Temp", x + 15, y + 15);

  // Value Display
  fill(173, 216, 230);
  textSize(36);
  text(tempVal + "°C", x + 15, y + 50);

  fill(255, 192, 203);
  textSize(14);
  text("Average: " + temp2Val + "°C", x + 15, y + 100);
}

// Example Widget Function: Simple Bar Gauge
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





