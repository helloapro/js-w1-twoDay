var goodReadsKey = require('./../.env').goodReadsKey;
var guardianKey = require('./../.env').guardianKey;
var parseString = require('xml2js').parseString;

$(function(){
  $("#book-search").submit(function(event){
    event.preventDefault();
    $('.book').matchHeight({ remove: true });
    $("#searchResults").empty();
    var searchString = $("#searchInput").val();
    $.get("https://www.goodreads.com/search/index.xml?key=" + goodReadsKey + "&q=" + searchString).then(function(response){
      var stuff = new XMLSerializer().serializeToString(response.documentElement);
      parseString(stuff, function(err, result){
        var works = result.GoodreadsResponse.search[0].results[0].work;
        for(var i = 0; i < works.length; i++){
          $("#searchResults").append("<div class='row'><div class='col-sm-1 book'><img class='img-responsive center-block' src='" + works[i].best_book[0].small_image_url[0] + "'> </div><div class='col-sm-3 book book-main'>Title: <em>" + works[i].best_book[0].title[0] + "</em><br> Written by: <strong>" + works[i].best_book[0].author[0].name[0] + "</strong> <br> Rating: " + works[i].average_rating[0] + "</div><div class='col-sm-8 book'></div></div>");
        }
      });
    }).then(function(){
      $(".book-main").click(bookClick);
      $('.book').matchHeight();
      $('.well').matchHeight({ remove: true });
    });
  });
});

function bookClick(){
    var thisThing = $(this);
    var title = $(this).find("em").text();
    var author = $(this).find("strong").text();
    console.log("a click!");
    $.get("https://www.goodreads.com/book/title.json?title=" + title + "&key=" + goodReadsKey).then(function(response){
      if(response.reviews_widget){
        $(thisThing).next().html("<div class='center-block review'>" + response.reviews_widget + "</div>");
        $.fn.matchHeight._update();
      } else {
        $(thisThing).next().html("<div class='center-block review'>No reviews yet, you should go review it! But we won't give you a link for that, you are on your own lololololololololol</div>");
      }
      $("div.review").click(function(){
        $(this).remove();
        $.fn.matchHeight._update();
      });
    });
  }
