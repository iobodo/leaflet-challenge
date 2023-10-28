
document.addEventListener("DOMContentLoaded", function() {
    // Initializing the map and setting its longitude, latitude, and the zoom level
    var mymap = L.map('map').setView([0, 0], 2);

    // Setting the maximum boundary of the map
    var southWest = L.latLng(-90, -180);
    var northEast = L.latLng(90, 180);
    var bounds = L.latLngBounds(southWest, northEast);
    mymap.setMaxBounds(bounds);

    // Adding a tile layer to the map ( background - street, satellite.)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors, © CARTO',
    maxZoom: 19
}).addTo(mymap);


    // Adding a legend to the map
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'legend'),
            magnitudes = [0, 10, 30, 50, 70, 90],
            labels = [];
    
        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
                magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    

    legend.addTo(mymap);

    // Fetching the GeoJSON data
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            L.geoJSON(data, {
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: feature.properties.mag * 5, // Adjusting the radius
                        fillColor: getColor(feature.properties.mag),
                        color: "#000",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).bindPopup("Type: " + feature.properties.type + "<br>Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + " km" + "<br>Location: " + feature.properties.place);
                }
            }).addTo(mymap);
        });

    // Defining the color of the marker based on the magnitude of the earthquake
    function getColor(mag) {
        return mag > 90 ? '#800026' :
               mag > 70 ? '#BD0026' :
               mag > 50 ? '#E31A1C' :
               mag > 30 ? '#FC4E2A' :
               mag > 10 ? '#FD8D3C' :
               '#FFEDA0';
    }
    

    // Call 'addTo' for the legend  if it's outside the onAdd function
    legend.addTo(mymap);
});
