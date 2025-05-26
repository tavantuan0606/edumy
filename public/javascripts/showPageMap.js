maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
    container: 'map', // ID của div chứa bản đồ
    style: maptilersdk.MapStyle.BRIGHT, // Hoặc một URL style khác
    center: stage.geometry.coordinates, // [lng, lat]
    zoom: 10
});

new maptilersdk.Marker()
    .setLngLat(stage.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${stage.title}</h3><p>${stage.location}</p>`
            )
    )
    .addTo(map)