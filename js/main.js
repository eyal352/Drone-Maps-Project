'use strict'

var map;
function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 18.1195526, lng: 45.7935141},
    zoom: 5
  });

  ko.applyBindings(new ViewModel());
};
var geocoder;

var ViewModel = function() {
  var self = this;
  var strikeLocations;

  this.strikeArray = ko.observableArray();

  geocoder = new google.maps.Geocoder();
  
//  this.searchInput = ko.observable("");
  
 /*  self.search = ko.computed(function() {
    // Got lines 51-53 from https://discussions.udacity.com/t/search-function-implemetation/15105/33
    return ko.utils.arrayFilter(self.strikeArray(), function(place) {
            return place.name.toLowerCase().indexOf(self.searchInput().toLowerCase()) >= 0;
    });
  }); */


  this.showInfo = function(strikeObject) {
     //show info window when the list item is clicked
    google.maps.event.trigger(strikeObject.marker, 'click');
  }

  var infowindow = new google.maps.InfoWindow();

// ajax for Drone Strike Data
  function DroneRequest() {
    return $.ajax({
    url: 'http://api.dronestre.am/data',
    dataType: 'jsonp',
  })
  // If there is an error detected, the following code will execute
    .error(function(jqXHR, exception) {
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

  // successful AJAX call will run the following code
  strikeData.done(function(response) {
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

      self.strikeArray.push(strike);
      })

  })
  
  
  // display error message if Google Maps doesn't load
  function googleError() {
    document.getElementById('map').innerHTML = "<h2>Google Maps did not load. Please refresh the page and try again.</h2>";
    };

  console.log(self.strikeArray());
}

