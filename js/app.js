(function() {
  'use strict';

var movies = [];

  const renderMovies = function() {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.Title
      });

      $title.tooltip({ delay: 50 }).text(movie.Title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.Poster,
        alt: `${movie.Poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('name', `${movie.imdbID}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.imdbID);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.Title);
      const $movieYear = $('<h6>').text(`Released in ${movie.Year}`);
      const $modalText = $('<p>').text(movie.Plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);
      $('.modal-trigger').leanModal();
    }
  };

  //grab search button
  var searchBtnEl = document.querySelector("#searchBtn")
  searchBtnEl.addEventListener("click", function(event){
    //prevent submittal
    event.preventDefault()

    //get the text the user entered
    var movieSearch = document.querySelector("#search").value
    console.log(movieSearch)

    //make sure the user actually entered something
    if(movieSearch){
      //encodeURI component converts special characters to uri format
      fetch(`https://omdb-api.now.sh/?s=${encodeURIComponent(movieSearch)}`)
        //convert the result into an array of movie objects
        .then((response)=>response.json())
        .then(function(data){
          if(data.Response){
            //put all the resultant movie objects into movies array and run movie render function to populate page
            movies = data.Search
            renderMovies()

            //once movie cards are rendered, grab all the Plot Synopsis buttons
            var plotButtonEls = document.querySelectorAll(".card-action a")
            //put even listeners on each
            for(var i = 0; i < plotButtonEls.length; i++){
              plotButtonEls[i].addEventListener("click", function(){
                console.log(this.name)
                //when clicked, fetch movie by imdbID attached to button
                fetch(`https://omdb-api.now.sh/?i=${this.name}`)
                  .then((response)=>response.json())
                  .then(function(data){

                    //add plot to modal then show modal?
                    console.log(data.Plot)
                  })
              })
            }
          }
      })
    }
  })

})();
