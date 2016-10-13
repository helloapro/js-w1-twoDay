var goodReadsKey = require('./../.env').goodReadsKey;
var googleKey = require('./../.env').googleKey;
var parseString = require('xml2js').parseString;

$(function(){
  $("#event-search").submit(function(event){
    event.preventDefault();
    $('.event').matchHeight({ remove: true });
    $("#eventResults").empty();
    var zip = $("#zipInput").val();
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
        }
      });
    }).then(function(){
      $('.event').matchHeight();
      $('.well').matchHeight({ remove: true });
    });
  });
});
