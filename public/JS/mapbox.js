// /* eslint-disable */
export const displayMap = (locations) => {
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
};
