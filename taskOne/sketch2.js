// ===================================================
// STUDENT TASK: Build a graphical dashboard for Seneye
// ===================================================

// Replace this with your teacher's Cloudflare Worker URL:
const PROXY_URL = "https://seneye-proxy.ezankov.workers.dev/";

// Toggle to true if you are working offline without network access
const USE_OFFLINE_MOCK = false;

let aquariumData = null;
let lastUpdated = "";

// Array to store historical temperature readings for average calculation
let tempHistory = [];

function preload() {
  // Load initial data before setup() runs
  let endpoint = USE_OFFLINE_MOCK ? "sample-data.json" : PROXY_URL;
  aquariumData = loadJSON(endpoint, onDataLoaded, onError);
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

  // Record temperature for average calculation
  let currentTemp = extractTemperature(data);
  if (currentTemp !== null) {
    tempHistory.push(currentTemp);
  }
}

function onError(err) {
  console.error("Failed to load aquarium data. Check proxy URL or network.", err);
}

// Helper function to safely extract temperature from response data
function extractTemperature(data) {
  if (!data) return null;
  
  // Safely check nested structure (matching your original line)
  if (Array.isArray(data) && data[0]?.exps?.temperature?.curr !== undefined) {
    return data[0].exps.temperature.curr;
  }
  // Fallback if temperature is at root
  if (data.temperature !== undefined) {
    return data.temperature;
  }
  return null;
}

// Helper function to calculate average temperature
function calculateAvgTemp() {
  if (tempHistory.length === 0) return 0;
  
  let sum = 0;
  for (let i = 0; i < tempHistory.length; i++) {
    sum += tempHistory[i];
  }
  
  // Return rounded to 1 decimal place
  return (sum / tempHistory.length).toFixed(1);
}

function draw() {
  background(20, 30, 45); // Dark blue aquarium background

  // 1. Draw Title Header
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Fish Environment Dashboard", 30, 30);

  // Display connection status
  textSize(12);
  fill(150, 200, 255);
  text("Last updated: " + (lastUpdated || "Loading..."), 30, 65);

  // 2. Render Dashboard Graphics
  if (aquariumData) {
    let temp = extractTemperature(aquariumData) || 0;
    let avgTemp = calculateAvgTemp();
    let ph = aquariumData.ph || 7.2;
    let nh3 = aquariumData.nh3 || 0.01;

    if (ph > 8) 
    fill(220, 50, 50);
    rect(30, 85, 720, 25, 5);
    
    fill(255);
    textSize(12);
    textAlign(LEFT, CENTER);
    text("⚠️ ALERT: pH level is dangerously high! (" + ph + ")", 40, 97.5);
    
    // Reset alignment back to top-left for the rest of your sketch
    textAlign(LEFT, TOP); 
  

  // Call your custom graphic widgets
  drawTempWidget(50, 120, temp, avgTemp);
  drawGaugeWidget(300, 120, "pH Level", ph, 6.0, 8.5);
  drawGaugeWidget(550, 120, "Ammonia (NH3)", nh3, 0.0, 0.05);


    // Call your custom graphic widgets
    drawTempWidget(50, 120, temp, avgTemp);
    drawGaugeWidget(300, 120, "pH Level", ph, 6.0, 8.5);
    drawGaugeWidget(550, 120, "Ammonia (NH3)", nh3, 0.0, 0.05);

  } else {
    // Loading State
    fill(255, 100, 100);
    textSize(18);
    text("Connecting to sensor stream...", 30, 120);
  }
}

// Updated Widget Function: Displays Current & Average Temperature
function drawTempWidget(x, y, tempVal, avgTempVal) {
  // Background Card
  fill(35, 48, 68);
  stroke(60, 80, 110);
  rect(x, y, 200, 150, 10);

  // Label
  noStroke();
  fill(180, 200, 220);
  textSize(14);
  text("Water Temp", x + 15, y + 15);

  // Value Display (Current Temp)
  fill(100, 220, 255);
  textSize(32);
  text(tempVal + "°C", x + 15, y + 50);

  // Average Temp Display
  fill(150, 180, 210);
  textSize(14);
  text("Avg: " + avgTempVal + "°C", x + 15, y + 100);
}

// Example Widget Function: Simple Bar Gauge
function drawGaugeWidget(x, y, label, val, minVal, maxVal) {
// Check if value is above safety threshold (e.g., pH > 8)
  let isWarning = val > 8;

  // Background Card - turn dark red/orange if warning is active
  if (isWarning) {
    fill(90, 20, 20);      // Dark red background
    stroke(255, 80, 80);    // Bright red border
  } else {
    fill(35, 48, 68);      // Normal dark blue background
    stroke(60, 80, 110);    // Normal border
  }
  rect(x, y, 200, 150, 10);

  // Label
  noStroke();
  fill(180, 200, 220);
  textSize(14);
  text(label, x + 15, y + 15);

  // Value Display
  if (isWarning) {
    fill(255, 100, 100);   // Red text for high value
  } else {
    fill(255);             // White text for normal value
  }
  textSize(28);
  text(val, x + 15, y + 50);

  // Optional: Add warning text at the bottom of the card
  if (isWarning) {
    fill(255, 80, 80);
    textSize(12);
    text("⚠️ WARNING: HIGH pH!", x + 15, y + 115);
  }
}


