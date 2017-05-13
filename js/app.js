'use strict';

(function() {

    //Initiate the object
    var app = {};

    //Body of a result containing the image, a title and the artist as well as the link to the album.
    app.album = function(SRC, TITLE, ARTIST, HREF, ID) {
        var ul = document.getElementById('albums');
        var li = document.createElement('LI');
        var div = document.createElement('DIV');
        div.classList.add('albumWrap');
        div.setAttribute('id', ID);
        var img = document.createElement('IMG');
        img.classList.add('album-art');
        img.setAttribute('src', SRC);
        li.appendChild(div);
        div.appendChild(img);
        var spanTitle = document.createElement('SPAN');
        var spanArtist = document.createElement('SPAN');
        var hrefAlbum = document.createElement('A');
        hrefAlbum.setAttribute('href', HREF);
        spanTitle.classList.add("album-title");
        spanTitle.textContent = TITLE;
        spanArtist.classList.add("album-artist");
        spanArtist.textContent = ARTIST;
        hrefAlbum.appendChild(spanTitle);
        li.appendChild(hrefAlbum);
        li.appendChild(spanArtist);
        ul.appendChild(li);
    };

  

    //Make the api call, loop through the results and display them on the page using the app.album function.
    app.ajax = function() {
        var searchBar = document.getElementById('search');
        var searchSubmit = document.getElementById('submit');
        var mainContent = document.getElementsByClassName('main-content');
            //On submit, prevent default browser behavior, retrieve the search value and construct a string.
            searchSubmit.addEventListener("click", function(event) { 
            event.preventDefault();
            var searchValue = searchBar.value;
            var url = "https://api.spotify.com/v1/search?q=" + searchValue + "&type=album";
           
            //If not result then break
            if (searchValue === '') {
                return;
            }

            //Remove initial message
            $(".main-content li").remove();

            //Make Ajax call
            $.get(url, function(data, textStatus, xhr) {

                //If no result, return an error.
                if ( data.albums.items.length === 0) {
                    app.error(); 
                    return;
                }

                //Loops through the data and display on the page.
                for (var i = 0; i < data.albums.items.length; i++) {
                    var src = data.albums.items[i].images[1].url;
                    var title = data.albums.items[i].name;
                    var artist = data.albums.items[i].artists[0].name;
                    var href = data.albums.items[i].artists[0].external_urls.spotify;
                    var id1 = data.albums.items[i].artists[0].id;
                    var id = data.albums.items[i].id;

                    app.album(src, title, artist, href, id);
                   };
            }).fail(function() {
                alert('Ajax call failed');
            });
     });
       
    }

    //Error message to display if there are not results.
    app.error = function() {
        var ul = document.getElementById('albums');
        var errorLi = document.createElement('LI');
        errorLi.classList.add('no-albums');
        var icon = document.createElement('I');
        icon.classList.add('material-icons');
        icon.classList.add('icon-help');
        icon.innerText = "help_outline";
        errorLi.appendChild(icon);
        errorLi.textContent = "No albums found that match \"" + $('#search').val() + "\"";
        ul.appendChild(errorLi);
    };

    //Creates the HTML for the overlay
    app.albumDetail = function (IMG, TITLE, ARTIST) {
        var wideOverlay = document.createElement('DIV');
        wideOverlay.classList.add('wideOverlay');
        var greyArea = document.createElement('DIV');
        greyArea.classList.add('greyArea');
        wideOverlay.appendChild(greyArea);
        var overlay = document.createElement('DIV');
        overlay.classList.add('overlay');
        greyArea.appendChild(overlay);
        var button = document.createElement("button");
        button.innerHTML = "< Back to search results";
        button.setAttribute('ID', 'goBack');
        overlay.appendChild(button);
        var album = document.createElement('IMG');
        album.setAttribute('alt', 'album');
        album.setAttribute('src', IMG);
        overlay.appendChild(album);
        var albumTitle = document.createElement('H1');
        albumTitle.textContent = TITLE;
        overlay.appendChild(albumTitle);
        var artist = document.createElement('P');
        artist.setAttribute('ID', 'artist');
        artist.textContent = ARTIST;
        overlay.appendChild(artist);
        var songs = document.createElement('DIV');
        songs.classList.add('songs');
        wideOverlay.appendChild(songs);
        var orderedList = document.createElement('OL');
        songs.appendChild(orderedList);
        $('body').append(wideOverlay);

       $('#goBack').on('click', function() {
          $('.wideOverlay').remove();
          $('.main-content').show();
         });
    }


    //On image click, hide main content, retrieve the user ID, make a new AJAX call and display the results on the page.
    $("#albums").on('click', function(event){
        $('.main-content').hide();
        //Retrieve the ID
        var albumID = event.target.parentElement.id;
        var albumURL = "https://api.spotify.com/v1/albums/" + albumID;

        //Make a new Ajax call to the Album endpoint to get album details.
        $.get(albumURL, function(data, textStatus, xhr) {
                    
                    var img = data.images[0].url;
                    var title = data.name;
                    var artist = data.artists[0].name;

                    //Display results on the page.
                    app.albumDetail(img, title, artist);
                    
                    //Loop through the songs and display them on the page.       
                    for (var i = 0; i < data.tracks.items.length; i++) {
                            var tracks = data.tracks.items[i].name;
                            var li = document.createElement('LI');
                            li.textContent = tracks;
                        $('ol').append(li);
                    }
        });  
});

        
        app.ajax();
  

}());



