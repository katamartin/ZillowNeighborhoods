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

    var input = document.getElementById('pac-input');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      }
      marker.setIcon(/** @type {google.maps.Icon} */({
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
      }));
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      var neighborhood = findNeighborhood(map, place) || "";
      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + neighborhood);
      infowindow.open(map, marker);
    });

    function findNeighborhood(map, place) {
      var latLng = new google.maps.LatLng(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
      var neighborhood;
      map.data.forEach(function(feature) {
        if (neighborhood || feature.getProperty("NAME") === "Oakland Airport") {
          return;
        }
        var poly = new google.maps.Polygon({paths: feature.j.j[0].j});
        if (google.maps.geometry.poly.containsLocation(latLng, poly)) {
          neighborhood = feature.getProperty("NAME");
        }
      });
      return neighborhood;
    };
  }
})();
