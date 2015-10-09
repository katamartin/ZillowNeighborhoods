(function () {
  if (typeof Map === "undefined") {
    window.Map = {};
  }

  Map.initMap = function() {
    var styles = [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }
    ];
    
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: { lat: 37.7833, lng: -122.4167 },
      styles: styles
    });

    map.data.loadGeoJson("./subset.geojson");
    map.data.setStyle(function(feature) {
      return { fillOpacity: 0.0, strokeWeight: 1.0 };
    });

    map.data.addListener('mouseover', function(event) {
      map.data.overrideStyle(event.feature, {fillColor: 'white', fillOpacity: 1.0 });
      var neighborhood = event.feature.getProperty("NAME");
      document.getElementById('neighborhood').textContent = neighborhood;
    });

    map.data.addListener('mouseout', function(event) {
      map.data.revertStyle();
      document.getElementById('neighborhood').textContent = "";
    });

  }
})();
