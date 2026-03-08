let routeLine = null;
let startMarker = null;
let endMarker = null;

const stations = {
  "Dejvická": [50.1007, 14.3935],
  "Malostranská": [50.0880, 14.4045],
  "Muzeum": [50.0797, 14.4300],
  "Náměstí Míru": [50.0755, 14.4378]
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

  // Draw route line
  routeLine = L.polyline(
    [startCoords, endCoords],
    { color: "red", weight: 5 }
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

  let route = "";
  let time = "";
  let badge = "";
  let icon = "";

  if (start === "Dejvická" && end === "Malostranská") {
    route = "Metro Line A";
    time = "3 minutes";
    badge = '<span class="metro-badge lineA">A</span>';
    icon = "🚇";
  }

  else if (start === "Muzeum" && end === "Náměstí Míru") {
    route = "Metro Line A";
    time = "1 minutes";
    badge = '<span class="metro-badge lineA">A</span>';
    icon = "🚇";
  }

  else if (start === "Malostranská" && end === "Muzeum") {
    route = "Tram 22";
    time = "9 minutes";
    badge = "";
    icon = "🚋";
  }

  else {
    route = "Bus 135 → Metro Line B";
    time = "18 minutes";
    badge = '<span class="metro-badge lineB">B</span>';
    icon = "🚌";
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