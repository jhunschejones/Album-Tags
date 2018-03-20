console.log("The custom script for the search page is running")
var albums = [];
var artists = [];
var pageReloaded = false;

// populate search results
function populateSearchResults(pageReloaded) {
    
    // stop button from reloading page

    if (pageReloaded == false) {
        event.preventDefault(event);
    }
    // get the value of the search box  
    var mySearch = $('#search_box').val();

    // clear the results spans
    $('.artist_results').html('');
    $('.album_results').html('');
    $('.warning_label').html('');

    // main functionality is wrapped in some basic error handling
    // dealing with blank results catagories
    if (mySearch != '') {
        $('.warning_label').html('');
        // this is pulling data from url and populating cards
        $.getJSON ( '/search/' + mySearch, function(rawData) {

            if (typeof(rawData.results.artists) != "undefined") {
                // this stores an array
                artists = rawData.results.artists.data;
                // add the label if there are artists
                $('.artists_label').text("Artists:")
                // iterate over artist results array
                for (let index = 0; index < 5; index++) {
                    $('.artist_results').append(`${artists[index].attributes.name} : <span class="text-secondary">${artists[index].attributes.genreNames[0]}</span> <br>`);
                }
                $('.artist_results').append(`<a href="#" onClick="expandArtistResults(event)">More</a> <br>`);   
            }

            if (typeof(rawData.results.albums) != "undefined") {
                // this stores an array
                albums = rawData.results.albums.data;
                // add the label if there are albums
                $('.albums_label').text("Albums:")                
                // iterate over album results array
                
                for (let index = 0; index < 5; index++) {
                    $('.album_results').append(`${albums[index].attributes.name} : <span class="text-secondary">${albums[index].attributes.artistName} (${albums[index].attributes.releaseDate.slice(0, 4)})</span> <a href="/albumdetails/${albums[index].id}">Details</a> <br>`);  
                };
                $('.album_results').append(`<a href="#" onClick="expandAlbumResults(event)">More</a> <br>`);           
            }
        })
    } else {
        $('.warning_label').append('<p>Enter an album or band name to search.</p>');
    }
};

function expandArtistResults(event) {

    event.preventDefault();
    $('.artist_results').html('');

    // iterate over artist results array
    artists.forEach(element => {
        $('.artist_results').append(`${element.attributes.name} : <span class="text-secondary">${element.attributes.genreNames[0]} <small>[<a href="" rel='${element.attributes.name},, ${element.id}' class="text-secondary">Albums</a>]</small></span> <span id="i${element.id}"></span> <br />`);
    });
    $('.artist_results').append(`<a href="#" onClick="populateSearchResults(event)">Less</a> <br>`);   
};


function expandAlbumResults(event) {

    event.preventDefault();
    $('.album_results').html('');
             
    // iterate over album results array
    albums.forEach(element => {
        $('.album_results').append(`${element.attributes.name} : <span class="text-secondary">${element.attributes.artistName} (${element.attributes.releaseDate.slice(0, 4)})</span> <a href="/albumdetails/${element.id}">Details</a> <br>`);
    });   
    $('.album_results').append(`<a href="#" onClick="populateSearchResults(event)">Less</a> <br>`);         
};





function showArtistAlbums(event) {

    event.preventDefault();
    var clickedLink = $(this).attr('rel');
    clickedLink = clickedLink.split(",,");

    var thisArtistName = clickedLink[0].trim();
    var thisArtistId = clickedLink[1].trim();

    $.getJSON ( '/search/' + thisArtistName, function(rawData) {

        if (typeof(rawData.results.albums) != "undefined") {
            // this stores an array
            var thisArtistAlbums = rawData.results.albums.data;
            $(`#i${thisArtistId}`).html('');
                  
            // iterate over album results array
            for (let index = 0; index < 5; index++) {
                
                $(`#i${thisArtistId}`).append(`<li>${thisArtistAlbums[index].attributes.name} : <span class="text-secondary">${thisArtistAlbums[index].attributes.artistName} (${albums[index].attributes.releaseDate.slice(0, 4)})</span> <a href="/albumdetails/${thisArtistAlbums[index].id}">Details</a></li>`);  
            };
   
        }
    })
}


$('.artist_results').on('click', 'a.text-secondary', showArtistAlbums);



// this happy little function reloads the search when someone gets to the page
// by using the back button from a different page
$( document ).ready(function() {
    if ($('#search_box').val() !== '') {
        pageReloaded = true;
        populateSearchResults(pageReloaded);
    }
    else {
        console.log("Page loaded with no search criteria");
    }
});
