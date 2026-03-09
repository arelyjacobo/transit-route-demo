let routeLine = null;
let startMarker = null;
let stopMarkers = [];
let endMarker = null;

const stations = {
  "Dejvická": [50.1007, 14.3935],
  "Hradčanská": [50.0972, 14.4044],
  "Malostranská": [50.0880, 14.4045],
  "Staroměstská": [50.0870, 14.4177],
  "Můstek": [50.0830, 14.4233],
  "Muzeum": [50.0797, 14.4300],
  "I.P. Pavlova": [50.0753, 14.4308],
  "Náměstí Míru": [50.0755, 14.4378]
};

const metroLineA = [
  "Dejvická",
  "Hradčanská",
  "Malostranská",
  "Staroměstská",
  "Můstek",
  "Muzeum",
  "I.P. Pavlova",
  "Náměstí Míru"
];

function getStationPath(start, end) {

  let startIndex = metroLineA.indexOf(start);
  let endIndex = metroLineA.indexOf(end);

  if (startIndex === -1 || endIndex === -1) return null;

  if (startIndex <= endIndex) {
    return metroLineA.slice(startIndex, endIndex + 1);
  } else {
    return metroLineA.slice(endIndex, startIndex + 1).reverse();
  }

}

function getRouteCoordinates(stationPath) {

  return stationPath.map(station => stations[station]);

}

const lineColors = {
  "A": "#00A550"
};

const routes = {

  "Dejvická-Malostranská": {
    route: "Metro Line A",
    time: "3 minutes",
    type: "A",
    icon: "🚇"
  },

  "Malostranská-Muzeum": {
    route: "Metro Line A",
    time: "5 minutes",
    type: "",
    icon: "🚇"
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

function getCurvedRoute(startCoords, endCoords) {

  let midLat = (startCoords[0] + endCoords[0]) / 2;
  let midLng = (startCoords[1] + endCoords[1]) / 2;

  midLng += 0.01;

  return [
    startCoords,
    [midLat, midLng],
    endCoords
  ];
}

function animateRoute(routeCoords, color) {

  let currentLine = L.polyline([], {
    color: color,
    weight: 6,
    opacity: 0.9,
    lineCap: "round"
  }).addTo(map);

  let i = 0;

  function drawNext() {
    if (i < routeCoords.length) {
      currentLine.addLatLng(routeCoords[i]);
      i++;
      setTimeout(drawNext, 80);
    }
  }

  drawNext();

  return currentLine;
}

function findRoute() {

  let start = document.getElementById("start").value;
  let end = document.getElementById("end").value;

  let startCoords = stations[start];
  let endCoords = stations[end];

let resultBox = document.getElementById("result");

let key = `${start}-${end}`;
let data = routes[key] || routes[`${end}-${start}`];

let color = "#00A550"; // default

if (data?.type === "A") {
  color = lineColors["A"];
} 

if (routeLine) map.removeLayer(routeLine);
if (startMarker) map.removeLayer(startMarker);
if (endMarker) map.removeLayer(endMarker);

stopMarkers.forEach(marker => map.removeLayer(marker));
stopMarkers = [];

  // Draw route line
let stationPath = getStationPath(start, end);

let routeCoords;

if (stationPath) {
  routeCoords = getRouteCoordinates(stationPath);
} else {
  routeCoords = getCurvedRoute(startCoords, endCoords);
}

if (stationPath && stationPath.length > 2) {

  for (let i = 1; i < stationPath.length - 1; i++) {

    let coords = stations[stationPath[i]];

    let stop = L.circleMarker(coords, {
      radius: 5,
      color: "#ffffff",
      weight: 2,
      fillColor: color,
      fillOpacity: 1
    }).addTo(map);

    stopMarkers.push(stop);

  }

}

routeLine = animateRoute(routeCoords, color);
map.fitBounds(routeLine.getBounds());

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

if (start === end) {

  resultBox.innerHTML = `
    <h2>Route Found</h2>
    <p class="stations"><strong>${start}</strong></p>
    <p class="route">You are already at this station.</p>
    <p class="time">Estimated time: 0 minutes</p>
  `;

  return;
}

  let route = "";
  let time = "";
  let badge = "";
  let icon = "";

  if (data) {
    route = data.route;
    time = data.time;
    badge = `<span class="metro-badge line${data.type}">${data.type}</span>`;
    icon = `<span class="icon">${data.icon}</span>`;
  } else {
    route = "No direct route found.";
    time = "N/A";
  }

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