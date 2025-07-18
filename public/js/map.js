document.addEventListener("DOMContentLoaded", function () {
  mapboxgl.accessToken = mapToken;

  let coordinates = listing?.geometry?.coordinates;

  // ⛑ If empty, use fallback coordinates (e.g., Delhi)
  if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
    console.warn("⚠️ Using fallback coordinates for map.");
    coordinates = [77.2090, 28.6139]; // Delhi
  }

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/outdoors-v12",
    center: coordinates,
    zoom: 9,
  });
map.scrollZoom.disable();  // disable scroll-zooming on map

  map.addControl(new mapboxgl.NavigationControl(), "top-right");

  map.on("load", () => {
    new mapboxgl.Marker({ color: "green" })
      .setLngLat(coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h5>${listing.title}</h5><p>Exact location will be shared after booking.</p>`
        )
      )
      .addTo(map);
  });
});



