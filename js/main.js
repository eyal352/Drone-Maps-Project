'use strict'

var map;
function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 19.6537752, lng: 60.6663377},
    zoom: 5
  });
};


var ViewModel = function() {
  var self = this;
  var strikeLocations;



// ajax for Drone Strike Data
  var DroneRequest = $.ajax({
    url: 'http://api.dronestre.am/data',
    dataType: 'jsonp',
    headers: 'http://127.0.0.1:64781/index.html'

  })
    .done(function(response){
       strikeLocations = response.strike;
      
      console.log(strikeLocations);
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

    console.log(strikeLocations);
}

ko.applyBindings(new ViewModel());