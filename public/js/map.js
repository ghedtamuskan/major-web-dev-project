
mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center:listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom

    });
  

//33  map marker using mapbos jl-js
    const marker = new mapboxgl.Marker({ color: "red" }) //listing geometry.coordinates
        .setLngLat(listing.geometry.coordinates)
        .setPopup(
       new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h5>${listing.title}</h5><p>Exact Location will be provided after booking </p>`
        )
    )
        .addTo(map);

