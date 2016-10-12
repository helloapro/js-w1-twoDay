var guardianKey = require('./../.env').guardianKey;

$(function(){

  $.get('http://content.guardianapis.com/search?section=books&page=1&show-fields=short-url,thumbnail&api-key='+guardianKey).then(function(response){
    console.log(response.response.results);
    for(var i = 0; i < response.response.results.length; i++){
      $("#newsBooks").append("<li><img class='img-responsive' src='" + response.response.results[i].fields.thumbnail + "'><a href='" + response.response.results[i].fields.shortUrl + "'>" + response.response.results[i].webTitle + "</a></li>");
    }

  }).then(function(){
    $('.well').matchHeight();
  });
});
