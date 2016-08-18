'use strict'

var map;
function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 19.6537752, lng: 60.6663377},
    zoom: 5
  });

  ko.applyBindings(new ViewModel());

};

var ViewModel = function() {
  var self = this;
  var strikeLocations;

  this.strikeArray = ko.observableArray();
  //on click - show location in console
  this.showInfo = function(location) {
    console.log(location);
  }

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
          console.log(msg + ' Please Try Again.');
    });
  }
  var strikeData = DroneRequest();
  // successful AJAX call will run the following code
  strikeData.done(function(response) {
    response.strike.forEach(function(strike) {
      var marker = new google.maps.Marker({
        position: {lat: Number(strike.lat), lng: Number(strike.lon) },
        title: strike.location,
        animation: google.maps.Animation.DROP,
        icon:  'img/drone.png',
        map: map
        });
      
      strike.marker = marker;
      self.strikeArray.push(strike);
      })

  })
 console.log(self.strikeArray());
}

