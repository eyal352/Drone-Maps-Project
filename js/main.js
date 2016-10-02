'use strict'

var map, bounds, geocoder;
function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 18.1195526, lng: 45.7935141},
    zoom: 5
  });
  bounds = new google.maps.LatLngBounds();
  ko.applyBindings(new ViewModel());
}

var ViewModel = function() {
  var self = this;
  var strikeLocations;

  self.strikeArray = ko.observableArray();

  geocoder = new google.maps.Geocoder();  // to geocode strike results with no Lat Lng value

  self.searchInput = ko.observable(""); // declaring input variable

  self.searchResults = ko.computed(function() {

    // if no input, return full array
    if (self.searchInput() === "") {
      // show all results on map
        // create a new bounds object
        bounds = new google.maps.LatLngBounds();
        // loop through strikeArray
        // if strike.marker.position exists,
        // extends bounds with it
        self.strikeArray().forEach(function(strike) {
          strike.marker.setVisible(true);
          if (strike.marker.position) bounds.extend(strike.marker.position);
        });
        // finally call map's fitBounds method with the bounds
        map.fitBounds(bounds);
        // show full list array
      return self.strikeArray();
    } else {
        // reset bounds to clear it
        bounds = new google.maps.LatLngBounds();

      return ko.utils.arrayFilter(self.strikeArray(), function(strike) {
        // logic for match to year or country
        var match = strike.country.toLowerCase().indexOf(self.searchInput().toLowerCase()) >= 0 || strike.date.toLowerCase().indexOf(self.searchInput().toLowerCase()) >= 0;
        strike.marker.setVisible(match);
        // if position has extended bounds, include on visible map
        if(match && strike.marker.position) {
          bounds.extend(strike.marker.position);
          map.fitBounds(bounds);
        }
        // if match returns, include in the list view display
        return match;
      });
    }
  });

  //show info window when the list item is clicked
  self.showInfo = function(strikeObject) {
    google.maps.event.trigger(strikeObject.marker, 'click');
    };
  var infowindow = new google.maps.InfoWindow();

// ajax for Drone Strike Data
  function DroneRequest() {
    return $.ajax({
    url: 'http://api.dronestre.am/data',
    dataType: 'jsonp',
  })
  .done(function(response) {
      response.strike.forEach(function(strike) {
        var marker = new google.maps.Marker({
          // defaults position to the town name if the lat and long are missing
          position: strike.lat === "" && strike.lon === "" ? geocoder.geocode( { 'address': strike.location}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();
                    } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                      //  setTimeout(wait, 5000);
                      //  console.log(strike.number);
                      console.log('Queries over the Google limit');
                    } else { console.log('Geocode was not successful for the following reason: ' + status + ' for ' + strike.number); }
                }) : {lat: Number(strike.lat), lng: Number(strike.lon)},
          title: strike.location,
          animation: google.maps.Animation.DROP,
          icon:  'img/bomb.png',
          map: map,
          deaths: strike.deaths,
          strikeDate: strike.date.slice(0,10),
          narrative: strike.narrative,
          town: strike.town === "" ? 'Unknown town name' : strike.town,
          article: strike.bij_link,
          });
        strike.marker = marker;

        var windowContent = '<div>'+ strike.narrative + '</div>' + "<div> <b>Location: </b>" + marker.town + ' in ' + marker.title + '</div>' + '</div>' + marker.deaths + ' Reported Casualties on ' + marker.strikeDate + '</div>' + '<div> Read more about the strike at <a href="'+ marker.article + '"target="_blank"> The Bureau Investigates </a></div>' + '<div>' + '<b>Learn more about ' + marker.title + ' on </b>' + '<a href="http://en.wikipedia.org/wiki/'+marker.title+'"' + 'target="_blank">' + 'Wikipedia' + '</a>' + '</div>';

        google.maps.event.addListener(marker, 'click', function () {
          infowindow.open(map, this);
          infowindow.setContent(windowContent);
          this.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(function () {
              marker.setAnimation(null);
                }, 700);
        });
        // if position extend bounds, include on visible map
        if (strike.marker.position) {
          bounds.extend(strike.marker.position);
        }

        self.strikeArray.push(strike);
        });
      map.fitBounds(bounds);
    })
      // If error detected, execute the following code
    .fail(function(jqXHR, exception) {
         var msg = '';
          if (jqXHR.status === 0) {
              msg = 'Not connect.\n Verify Network.';
          } else if (jqXHR.status == 404) {
              msg = 'Requested page not found. [404]';
          } else if (jqXHR.status == 500) {
              msg = 'Internal Server Error [500].';
          } else if (exception === 'parsererror') {
              msg = 'Requested JSON parse failed.';
          } else if (exception === 'timeout') {
              msg = 'Time out error.';
          } else if (exception === 'abort') {
              msg = 'Ajax request aborted.';
          } else {
              msg = 'Uncaught Error.\n' + jqXHR.responseText;
          }
          alert(msg + ' Please Try Again.');
    });
  }

  var strikeData = DroneRequest();
  console.log(self.strikeArray());
};

  // display error message if Google Maps doesn't load
function googleError() {
  document.getElementById('map').innerHTML = "<h2>Google Maps did not load. Please refresh the page and try again.</h2>";
}