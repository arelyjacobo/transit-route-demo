let routeLine = null;
let startMarker = null;
let endMarker = null;

const stations = {
  "Dejvická": [50.1007, 14.3935],
  "Malostranská": [50.0880, 14.4045],
  "Muzeum": [50.0797, 14.4300],
  "Náměstí Míru": [50.0755, 14.4378]
};

const lineColors = {
  "A": "#2ca25f",  
  "tram": "#d73027"
};

const routes = {

  "Dejvická-Malostranská": {
    route: "Metro Line A",
    time: "3 minutes",
    type: "A",
    icon: "🚇"
  },

  "Malostranská-Muzeum": {
    route: "Tram 22",
    time: "9 minutes",
    type: "",
    icon: "🚋"
  },

  "Muzeum-Náměstí Míru": {
    route: "Metro Line A",
    time: "1 minute",
    type: "A",
    icon: "🚇"
  }

};

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

function findRoute() {

  let start = document.getElementById("start").value;
  let end = document.getElementById("end").value;

  let startCoords = stations[start];
  let endCoords = stations[end];

if (routeLine) map.removeLayer(routeLine);
if (startMarker) map.removeLayer(startMarker);
if (endMarker) map.removeLayer(endMarker);

let color = "#d73027"; // default

if (data?.type === "A") {
  color = lineColors["A"];
} else if (data?.icon === "🚋") {
  color = lineColors["tram"];
}

  // Draw route line
routeLine = L.polyline(
  [startCoords, endCoords],
  {
    color: color,
    weight: 6,
    opacity: 0.9,
    lineCap: "round",
    dashArray: "10, 10"
  }
).addTo(map);

  // Add start marker
  startMarker = L.marker(startCoords)
    .addTo(map)
    .bindPopup("Start: " + start)
    .openPopup();

  // Add end marker
  endMarker = L.marker(endCoords)
    .addTo(map)
    .bindPopup("Destination: " + end);

  // Zoom map to fit route
  map.fitBounds(routeLine.getBounds());

let key = [start, end].sort().join("-");
let data = routes[key];

  let route = "";
  let time = "";
  let badge = "";
  let icon = "";

  if (start === end) {

  resultBox.innerHTML = `
    <h2>Route Found</h2>
    <p class="stations"><strong>${start}</strong></p>
    <p class="route">You are already at this station.</p>
    <p class="time">Estimated time: 0 minutes</p>
  `;

  return;
}

  if (data) {
    route = data.route;
    time = data.time;
    badge = `<span class="metro-badge line${data.type}">${data.type}</span>`;
    icon = `<span class="icon">${data.icon}</span>`;
  } else {
    route = "No direct route found.";
    time = "N/A";
  }

  let resultBox = document.getElementById("result");

  resultBox.innerHTML = `
    <h2>Route Found</h2>
    <p class="stations"><strong>${start}</strong> → <strong>${end}</strong></p>
    <p class="route">${icon} ${badge} ${route}</p>
    <p class="time">Estimated time: ${time}</p>
  `;

  resultBox.classList.add("show");
}

let map = L.map('map').setView([50.0755, 14.4378], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function swapStations() {

  let startSelect = document.getElementById("start");
  let endSelect = document.getElementById("end");

  let temp = startSelect.value;
  startSelect.value = endSelect.value;
  endSelect.value = temp;

  findRoute();
}