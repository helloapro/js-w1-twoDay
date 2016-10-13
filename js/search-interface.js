var goodReadsKey = require('./../.env').goodReadsKey;
var guardianKey = require('./../.env').guardianKey;
var parseString = require('xml2js').parseString;

$(function(){
  $("#book-search").submit(function(event){
    event.preventDefault();
    $('.book').matchHeight({ remove: true });
    $("#searchResults").empty();
    $("#newsResults").empty();
    var searchString = $("#searchInput").val();
    $.get("https://www.goodreads.com/search/index.xml?key=" + goodReadsKey + "&q=" + searchString).then(function(response){
      var stuff = new XMLSerializer().serializeToString(response.documentElement);
      parseString(stuff, function(err, result){
        var works = result.GoodreadsResponse.search[0].results[0].work;
        if(works){

          for(var i = 0; i < 5; i++){
            $("#searchResults").append("<div class='row'><div class='col-md-1 book'><img class='img-responsive center-block' src='" + works[i].best_book[0].small_image_url[0] + "'> </div><div class='col-md-4 book book-main'><div>Title: <em>" +
            works[i].best_book[0].title[0] + "</em><br> Written by: <strong>" +
            works[i].best_book[0].author[0].name[0] + "</strong> <br> Rating: " +
            works[i].average_rating[0] + "<span class='book_id'>" +
            works[i].best_book[0].id[0]._ + "</span></div></div><div class='col-md-7 book'></div></div><hr>");
          }
        } else {
          $("#searchResults").append("Sorry, no search results found!");
        }
      });
    }).then(function(){
      if($("#searchResults").text() != "Sorry, no search results found!"){
        $(".book-main").click(bookClick);
        $('.book').matchHeight();
        $('.well').matchHeight({ remove: true });
      }
    });

    $.get("http://content.guardianapis.com/search?q=" + searchString + "&page=1&api-key=" + guardianKey).then(function(response){
      if(response.response.results.length > 0){
        for(var i = 0; i < response.response.results.length; i++){
          var formattedDate = moment(response.response.results[i].webPublicationDate).format("LL");
          $("#newsResults").append("<li><a href='" + response.response.results[i].webUrl + "'>" + formattedDate + " - " +  response.response.results[i].webTitle + "</a></li>");
        }
      } else {
        $("#newsResults").append("Sorry, no search results found!");
      }
    });
  });
});

function bookClick(){
    var thisThing = $(this);
    var id = $(this).find("span.book_id").text();
    var author = $(this).find("strong").text();
    $.get("https://www.goodreads.com/book/show.json?id=" + id + "&key=" + goodReadsKey).then(function(response){
      if(response.reviews_widget){
        $(thisThing).next().html("<div class='center-block review'>" + response.reviews_widget.replace(/565px|565/g, "100%") + "</div>");
        $('.book').matchHeight({ remove: true });
        $('.book').matchHeight();
      } else {
        $(thisThing).next().html("<div class='center-block review'>No reviews yet, you should go review it! But we won't give you a link for that, you are on your own lololololololololol</div>");
      }
      $("div.review").click(function(){
        $(this).remove();
        $('.book').matchHeight({ remove: true });
        $('.book').matchHeight();
      });
    });
  }
