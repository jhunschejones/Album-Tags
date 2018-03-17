console.log("The custom script for the search page is running")

// populate search results
function populateSearchResults() {
    
    // stop button from reloading page
    event.preventDefault();
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
                var artists = rawData.results.artists.data;
                // add the label if there are artists
                $('.artists_label').text("Artists:")
                // iterate over artist results array
                artists.forEach(element => {
                    $('.artist_results').append(element.attributes.name, ': <i>', element.attributes.genreNames[0], '</i> <br>');
                });
            }

            if (typeof(rawData.results.albums) != "undefined") {
                // this stores an array
                var albums = rawData.results.albums.data;
                // add the label if there are albums
                $('.albums_label').text("Albums:")                
                // iterate over album results array
                albums.forEach(element => {
                    $('.album_results').append(element.attributes.name, ': <i>', element.attributes.genreNames[0], '</i> <a href="/albumdetails/' + element.id + '">Details</a> <br>');
                });            
            }
        })
    } else {
        $('.warning_label').append('<p>Enter an album or band name to search.</p>')
        $('#search_box').val() == '';
    }
};
