// -------- START UTILITIES ---------
console.log("The custom script for the search page is running");

function hideDOMelement(elementId) {
    try {
        let element = document.getElementById(elementId)
        element.style.display = "none";
    } catch (error) {
        // this element does not exist yere
    }
}

function showDOMelement(elementId) {
    try {
        let element = document.getElementById(elementId)
        element.style.display = "block";
    } catch (error) {
        // this element does not exist yere
    }
}
// ----------- END UTILITIES -----------

var albums = [];
var artists = [];
var pageReloaded = false;
var emptyArtists = false;
var emptyAlbums = false;

// populate search results
function populateSearchResults(pageReloaded) {    
    showDOMelement("loader");
    hideDOMelement("artists_label");
    hideDOMelement("albums_label");
    
    // stop button from reloading page
    if (pageReloaded == false) {
        event.preventDefault(event);
    }
    // get the value of the search box  
    var mySearch = $('#search_box').val();

    // reset the results spans

    $('.artist_results').html('');
    $('.album_results').html('');
    $('#warning_label').html('');
    hideDOMelement("warning_label");

    // main functionality is wrapped in some basic error handling
    // dealing with blank results catagories
    if (mySearch != '') {
        $('#warning_label').html('');
        hideDOMelement("warning_label");
        showDOMelement("results_returned");

        // this is pulling data from url and populating cards
        $.getJSON ( '/search/' + mySearch, function(rawData) {

            if (typeof(rawData.results.artists) != "undefined") {
                showDOMelement("artists_label");
                // this stores an array
                artists = rawData.results.artists.data;
                emptyArtists = false;                
                populateArtistResults();

            } else {
                emptyArtists = true;
                showDOMelement("warning_label");
                $('#warning_label').append('<p>No artists match this search</p>');
            }

            if (typeof(rawData.results.albums) != "undefined") {
                showDOMelement("albums_label");
                // this stores an array
                albums = rawData.results.albums.data;
                emptyAlbums = false;
                populateAlbumResults();

            } else {
                emptyAlbums = true;
                showDOMelement("warning_label");
                $('#warning_label').append('<p>No albums match this search</p>');
            }

            hideDOMelement("loader");
            if (emptyAlbums == true && emptyArtists == true) {
                hideDOMelement("results_returned");
            } else {
                showDOMelement("results_returned");
            }

        })
    } else {
        showDOMelement("warning_label");
        $('#warning_label').append('<p>Enter an album or band name to search.</p>');
        hideDOMelement("loader");
        hideDOMelement("results_returned");
    }
};

function populateArtistResults() {
    $('.artist_results').html('');

    try {
        // add the label if there are artists
        $('.artists_label').text("Artists:")
        // iterate over artist results array
        for (let index = 0; index < 5; index++) {
            $('.artist_results').append(`${artists[index].attributes.name} : <span class="text-secondary">${artists[index].attributes.genreNames[0]} </span> <a href="" rel='${artists[index].attributes.name},, ${artists[index].id}' class="morealbumslink">Albums</a> <span id="i${artists[index].id}"></span> <br />`);
        }
        $('.artist_results').append(`<button class="btn btn-outline-primary btn-sm btn_xsm" onClick="expandArtistResults(event)">More Artists</button> <br>`);   
    }
    catch(err) {
        // console.log("There are less than 5 albums for one of these artists");
    }
}

function populateAlbumResults() {
    $('.album_results').html('');

    try {
        // add the label if there are albums
        $('.albums_label').text("Albums:")                
        // iterate over album results array
        
        for (let index = 0; index < 5; index++) {
            $('.album_results').append(`${albums[index].attributes.name} : <span class="text-secondary">${albums[index].attributes.artistName} (${albums[index].attributes.releaseDate.slice(0, 4)})</span> <a href="/albumdetails/${albums[index].id}">Details</a> <br>`);  
        };
        $('.album_results').append(`<button class="btn btn-outline-primary btn-sm btn_xsm" onClick="expandAlbumResults(event)">More Albums</button> <br>`);    
    }
    catch(err) {
        console.log(err);
    }
}

function expandArtistResults(event) {

    event.preventDefault();
    $('.artist_results').html('');

    // iterate over artist results array
    artists.forEach(element => {
        $('.artist_results').append(`${element.attributes.name} : <span class="text-secondary">${element.attributes.genreNames[0]} </span> <a href="" rel='${element.attributes.name},, ${element.id}' class="morealbumslink">Albums</a> <span id="i${element.id}"></span> <br />`);
    });
    $('.artist_results').append(`<button class="btn btn-outline-primary btn-sm btn_xsm" onClick="populateArtistResults()">Less Artists</button> <br>`);   
};


function expandAlbumResults(event) {

    event.preventDefault();
    $('.album_results').html('');
             
    // iterate over album results array
    albums.forEach(element => {
        $('.album_results').append(`${element.attributes.name} : <span class="text-secondary">${element.attributes.artistName} (${element.attributes.releaseDate.slice(0, 4)})</span> <a href="/albumdetails/${element.id}">Details</a> <br>`);
    });   
    $('.album_results').append(`<button class="btn btn-outline-primary btn-sm btn_xsm" onClick="populateAlbumResults()">Less Albums</button> <br>`);         
};



function showArtistAlbums(event) {

    event.preventDefault();
    var clickedLink = $(this).attr('rel');
    clickedLink = clickedLink.split(",,");
    showDOMelement("loader");

    var thisArtistName = clickedLink[0].trim();
    var thisArtistId = clickedLink[1].trim();

    $.getJSON ( '/search/' + thisArtistName, function(rawData) {

        if (typeof(rawData.results.albums) != "undefined") {
            try {
                // this stores an array
                var thisArtistAlbums = rawData.results.albums.data;
                $(`#i${thisArtistId}`).html('');
                    
                // iterate over album results array
                for (let index = 0; index < 5; index++) {
                    
                    $(`#i${thisArtistId}`).append(`<li>${thisArtistAlbums[index].attributes.name} : <span class="text-secondary">${thisArtistAlbums[index].attributes.artistName} (${albums[index].attributes.releaseDate.slice(0, 4)})</span> <a href="/albumdetails/${thisArtistAlbums[index].id}">Details</a></li>`);  
                }
                hideDOMelement("loader");
            }
            catch(err) {
                // less than 5 albums for this artist
                hideDOMelement("loader");
            }
        }
    })
};


$('.artist_results').on('click', 'a.morealbumslink', showArtistAlbums);


// this happy little function reloads the search when someone gets to the page
// by using the back button from a different page
$( document ).ready(function() {
    if ($('#search_box').val() !== '') {
        pageReloaded = true;
        populateSearchResults(pageReloaded);

        // if we don't reset pageReloaded to false here, user can't search a new string
        pageReloaded = false;
    }
    else {
        console.log("Page loaded with no search criteria");
    }
});


// event listener called when enter is pressed with value in text form
// doesn't appear to be needed
//
// $("form").submit(function (e) {
//     e.preventDefault();
//     pageReloaded = false;
//     populateSearchResults(pageReloaded);
// });
