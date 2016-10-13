var goodReadsKey = require('./../.env').goodReadsKey;
var googleKey = require('./../.env').googleKey;
var parseString = require('xml2js').parseString;

$(function(){

  $("#event-search").submit(function(event){
    event.preventDefault();
    $("#map").empty();
    $('.event').matchHeight({ remove: true });
    $("#eventResults").empty();
    var zip = $("#zipInput").val();
    $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + zip + "&key=" + googleKey).then(function(response){
      var lat = response.results[0].geometry.location.lat;
      var lng = response.results[0].geometry.location.lng;
      $("#map").append("<script id='mapScript'> var map;" +
        "function initMap() {" +
        "map = new google.maps.Map(document.getElementById('map'), {" +
        "center: {lat: " + lat + ", lng: " + lng + "}," +
        "zoom: 8" +
        "});}</script>");
      $("#map").append("<script async defer src='https://maps.googleapis.com/maps/api/js?key=" + googleKey + "&callback=initMap'></script>");
      $("#map").show();
    }).then(function(){
      $.get("https://www.goodreads.com/event/index.xml?search[postal_code]="  + zip + "&key=" + goodReadsKey).then(function(response){
        var stuff = new XMLSerializer().serializeToString(response.documentElement);
        parseString(stuff, function(err, result){
          var events = result.GoodreadsResponse.events[0].event;
          var forLoop = events.length > 10 ? 10 : events.length;
          for(var i = 0; i < forLoop; i ++){
            var formattedDate = moment(events[i].start_at[0]._).format("LLL");
            $("#eventResults").append("<div class='row'><div class='col-md-3 event'><img class='img-responsive center-block' src='" + events[i].image_url[0] + "'> </div><div class='col-md-9 event'>Event Name: <a href='" + events[i].link[0] + "'><strong>" +
            events[i].title[0] + "</a></strong><br> Date: " +
            formattedDate + " <br> Venue: " +
            events[i].venue[0] + "</div></div>");
            var address = events[i].address[0] + " " + events[i].postal_code[0];
            var title = events[i].title[0];
            appendMarkers(address, title);
          }
        });
      }).then(function(){
        $('.event').matchHeight();
        $('.well').matchHeight({ remove: true });
      });
    });
  });
});

// function initMap(){
//   map = new google.maps.Map(document.getElementById('map'), {
// 		center: {
// 			lat: -34.397,
// 			lng: 150.644
// 		},
// 		zoom: 8
// 	});
// }

function appendMarkers(address, title){
  title = title.replace(/[\'\\\^\?\+\{\(\|\)\*]/g, "");
  $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + googleKey).then(function(response){
      $("#map").append("<script>var infowindow = new google.maps.InfoWindow({}); var latLng = new google.maps.LatLng(" + response.results[0].geometry.location.lat + "," + response.results[0].geometry.location.lng + "); var marker = new google.maps.Marker({position: latLng}); marker.setMap(map); google.maps.event.addListener(marker, 'click', (function(marker){return function() {infowindow.setContent( '" + title + "'); infowindow.open(map, marker);}})(marker));</script>");
  });
}
