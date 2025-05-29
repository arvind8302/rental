mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // ✅ Correct style URL
  center: listing.geometry.coordinates,
  zoom: 9,
});


// Create a new marker.
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.title} </h4>  <P> Exact location Provided After Booking </p> `
    )
  )

  .addTo(map);
