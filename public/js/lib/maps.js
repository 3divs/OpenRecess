// Displays and locates the user's location
var geocoder;
var map;
var createMarker;
var infobox;
// var moment = require('moment');

// Defaults to San Francisco
var lat = 37.783;
var lng = -122.409;
var markerArray = [];

// Content for infobox
var boxText = document.createElement("div");
boxText.setAttribute('class', "infobox");
boxText.style.cssText = "text-align: center; height: auto; border: 1px solid black; margin-top: 8px; background: #34495e; padding: 10px; color: white; border-radius: 10px; width: auto";

function initialize(gameData) {
  var mapOptions = {
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: style
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);

  // Locates the user on the map
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
  // If GeoLocation is not supported, calls the handleNoGeoLocation function
    handleNoGeolocation(false);
  }

  // Creates a marker for games in database
  var infowindow = new google.maps.InfoWindow({map: map});
  var gameList = document.getElementById('places');
  var ib = new InfoBox(myOptions);

  gameData.on('sync', function() {

    if (!gameList) {
      // Adds marker on click only on Create Game
      google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng);
      });

      // add Search Box in Create Game section
      var input = (document.getElementById('target'));
      var searchBox = new google.maps.places.SearchBox(input);
      var markers = [];
      google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();
        for (var i = 0, marker; marker = markers[i]; i++) {
          marker.setMap(null);
        }

        markers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
          var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
          });
          markers.push(marker);
          bounds.extend(place.geometry.location);
        }
        map.fitBounds(bounds);
      });

      google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
      });
    }
    // markerArray = [];
    for (var i = 0; i < gameData.length; i++) {
      var createMarker = new google.maps.Marker({
        position: new google.maps.LatLng(gameData.at(i).get('coord').lat, gameData.at(i).get('coord').lon),
        map: map,
        title: gameData.at(i).get('gameName'),
        time: gameData.at(i).get('gameTime'),
        date: gameData.at(i).get('gameDate'),
        min: gameData.at(i).get('minimumPlayers'),
        code: gameData.at(i).get('gameCode'),
        animation: google.maps.Animation.DROP,
        type: gameData.at(i).get('gameType')
      });

      var content = createMarker.title + '<br /> on ' + moment(createMarker.date).format("LL") + '<br />at ' + createMarker.time;
      makeInfoWindowEvent(map, infowindow, content, createMarker);
      markerArray.push(createMarker);
      gameList.innerHTML += '<li data-id=' + createMarker.__gm_id + '>' +
        '<span class="gamelist-title todo-name"></span>' +
        '<button class="btn-mini btn" data-code=' + createMarker.code +'>Join</button> ' + createMarker.type + ' <br /><span class="dateText"> ' + moment(createMarker.date).fromNow() + '<span></li>';
    }
  });

  var step = 100;
  var scrolling = false;
  $("#showMore").bind("click", function(event) {
    event.preventDefault();
    $("#places").animate({
        scrollTop: "+=" + step + "px"
    });
  });

  // Connect side-panel with events on the map
  var holder;
  $('#results').on('click', 'li', function(){
    var getId = $(this).data("id");
    for (var i = 0; i < markerArray.length; i++) {
      if (getId === markerArray[i].__gm_id) {
        holder = markerArray[i];
      }
    }
    boxText.innerHTML = holder.title + '<br /> on ' + moment(holder.date).format("LL") + '<br />at ' + holder.time;
    ib.open(map, holder);
  });

  $('#places').on('click', '.btn-mini', function (e) {
    var code = $(this).data().code;
    var phone = App.currentUser.attributes.phone;
    if (App.currentUser.attributes.phone) {
      phone.length === 10 ? phone = '+1' + phone : phone = phone;
      $.ajax({
        url: '/game',
        contentType: 'application/json',
        type: 'PUT',
        data: JSON.stringify({
          code: code,
          phone: phone
        }),
        dataType: 'json',
        error: function(error) { alert(error); },
        success: function() {
          $(e.target).closest('button').text('Joined').css('background-color','green').removeClass('btn-mini').append('<br>');
        }
      });
    } else {
      App.currentUser.trigger('redirectLogin');
    }
  });

  // Search Box in List Games
  // TODO: use regex to search for games.  Convert markerArray to lowercase
  $('.todo-search-field').keypress(function (e) {
    if (e.which == 13) {
      var search = $('.todo-search-field').val().toLowerCase();
      for (var i = 0; i < markerArray.length; i++) {
        if (search === markerArray[i].type.toLowerCase()) {
          holder = markerArray[i];
        }
      }
      boxText.innerHTML = holder.title + '<br /> on ' + moment(holder.date).format("LL") + '<br />at ' + holder.time;
      ib.open(map, holder);

      $('.todo-search-field').val("");
      return false;
    }
  });

  // Displays pop-up when marker is clicked
  var makeInfoWindowEvent = function(map, infowindow, contentString, marker) {
    google.maps.event.addListener(marker, 'click', function() {
      boxText.innerHTML = contentString;
      ib.open(map, this);
    });
  };
}

var handleNoGeolocation = function(errorFlag) {
  var content;
  if (errorFlag) {
    content = 'Error: The Geolocation service failed.';
  } else {
    content = 'Error: Your browser doesn\'t support geolocation.';
  }
  // If GeoLocation is not possible, defaults to San Francisco area.
  var options = {
    map: map,
    position: new google.maps.LatLng(lat, lng)
  };
  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
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

var placeMarker = function(location) {
  // Clears the marker (does not delete) from the map before placing the new marker
  clearMarker();
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markerArray.push(marker);
  console.log('marker location: ' + marker.getPosition());
  var loc = marker.getPosition();
  $('.lon').val(loc.lng());
  $('.lat').val(loc.lat());
};

// Helper function to translate address to LatLng
// Need to input #address
var codeAddress = function() {
  // var address = '944 market st., san francisco, ca'
  var address = document.getElementById("address").value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
};

// Map style
var style = [{
  stylers: [
    { lightness: -10 },
    { gamma: 1.51 }
  ]
}];

// Option for infobox.
var myOptions = {
  content: boxText,
  disableAutoPan: false,
  maxWidth: 150,
  pixelOffset: new google.maps.Size(-140, 5),
  zIndex: null,
  boxStyle: {
    background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
    opacity: 0.6,
    width: "200px"
  },
  closeBoxMargin: "12px 4px 2px 2px",
  closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
  infoBoxClearance: new google.maps.Size(1, 1)
};
