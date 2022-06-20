// /* eslint-disable */

// // ----------------------------------------------
// // Get locations from HTML
// // ----------------------------------------------

const locations = JSON.parse(document.getElementById('map').dataset.locations);

// // ----------------------------------------------
// // Create the map and attach it to the #map
// // ----------------------------------------------

// const map = L.map('map', { zoomControl: false });

// // ----------------------------------------------
// // Add a tile layer to add to our map
// // ----------------------------------------------

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution:
//     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// }).addTo(map);

// // ----------------------------------------------
// // Create icon using the image provided by Jonas
// // ----------------------------------------------

// var greenIcon = L.icon({
//   iconUrl: '/img/pin.png',
//   iconSize: [32, 40], // size of the icon
//   iconAnchor: [16, 45], // point of the icon which will correspond to marker's location
//   popupAnchor: [0, -50], // point from which the popup should open relative to the iconAnchor
// });

// // ----------------------------------------------
// // Add locations to the map
// // ----------------------------------------------

// const points = [];
// locations.forEach((loc) => {
//   // Create points
//   points.push([loc.coordinates[1], loc.coordinates[0]]);

//   // Add markers
//   L.marker([loc.coordinates[1], loc.coordinates[0]], { icon: greenIcon })
//     .addTo(map)
//     // Add popup
//     .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
//       autoClose: false,
//       className: 'mapPopup',
//     })
//     .openPopup();
// });

// // ----------------------------------------------
// // Set map bounds to include current location
// // ----------------------------------------------

// const bounds = L.latLngBounds(points).pad(0.5);
// map.fitBounds(bounds);

// // Disable scroll on map
// map.scrollWheelZoom.disable();

mapboxgl.accessToken =
  'pk.eyJ1IjoibXJpZHVsOTEiLCJhIjoiY2w0bGwzZm81MTQxOTNqbW5uOHM5ZnlzeCJ9.PqAOMqGjH3IbUEOXrzIAkg';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mridul91/cl4llr1y6002016miv2scssrq',
  // center: [77.1025, 28.7041],
  scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();
locations.forEach((loc) => {
  const el = document.createElement('div');
  el.className = 'marker';

  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);
  new mapboxgl.Popup({ offset: 30 })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);
  bounds.extend(loc.coordinates);
});
map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
