
// Displays and locates the user's location
var geocoder;
var map;
var lat = 37.783;
var lng = -122.409;
var markerArray = [];

// Locates the user on the map
function initialize() {
  // Translate address to Lat and Lng
  geocoder = new google.maps.Geocoder();

  var mapOptions = {
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);

  // Adds marker on click
  google.maps.event.addListener(map, 'click', function(event) {
    placeMarker(event.latLng);
  });

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'Lat: ' + position.coords.latitude + '\n\nLong: ' + position.coords.longitude
      });
      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
  // If GeoLocation is not supported, calls the handleNoGeoLocation function
    handleNoGeolocation(false);
  }
}

var handleNoGeolocation = function(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  // If GeoLocation is not possible, defaults to San Francisco area.
  var options = {
    map: map,
    position: new google.maps.LatLng(lat, lng)
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
};

// If clicked, draws marker
var placeMarker = function(location) {
  // Clears the marker (does not delete) from the map before placing the new marker
  clearMarker();
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markerArray.push(marker);
  // map.setCenter(marker.getPosition());
  console.log('marker location: ' + marker.getPosition());
};

// Clear markers
var clearMarker = function() {
  if (markerArray) {
    for (var i = 0; i < markerArray.length; i++) {
      markerArray[i].setMap(null);
    }
  markerArray = [];
  }
};

// google.maps.event.addDomListener(window, 'load', initialize);

// Helper function to translate address to LatLng
// Need to input #address
// var codeAddress = function() {
//   var address = '944 market st., san francisco, ca'
//   // var address = document.getElementById("address").value;
//   geocoder.geocode( { 'address': address}, function(results, status) {
//     if (status == google.maps.GeocoderStatus.OK) {
//       map.setCenter(results[0].geometry.location);
//       var marker = new google.maps.Marker({
//           map: map,
//           position: results[0].geometry.location
//       });
//     } else {
//       alert("Geocode was not successful for the following reason: " + status);
//     }
//   });
// }
