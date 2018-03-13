var selectedTags = $(".heres_the_selected_tags").text();
selectedTags = selectedTags.split(",")

selectedTags.forEach(element => {
    // go through the array and remove the item 
    let index = selectedTags.indexOf(element)
    selectedTags.splice(index, 1);
    // trim any spaces off the ends of the item
    element = element.trim();
    // put the item back in the array
    selectedTags.push(element);
});

// need to keep working on this
function populateTagSearchResults(selectedTags) {
    // main functionality is wrapped in some basic error handling
    // dealing with blank results catagories
    if (mySearch != '') {
        $('.warning_label').html('');
        // this is pulling data from url and populating cards
        $.getJSON ( '/tags/database/' + mySearch, function(rawData) {

            if (typeof(rawData.results.artists) != "undefined") {
                // this stores an array
                var artists = rawData.results.artists.data;
                // iterate over artist results array
                artists.forEach(element => {
                    $('.artist_results').append(element.attributes.name, ': <i>', element.attributes.genreNames[0], '</i> <br>');
                });
            }

            if (typeof(rawData.results.albums) != "undefined") {
                // this stores an array
                var albums = rawData.results.albums.data;
                // iterate over album results array
                albums.forEach(element => {
                    $('.album_results').append(element.attributes.name, ': <i>', element.attributes.genreNames[0], '</i> <a href="/albumdetails/' + element.id + '">Details</a> <br>');
                });            
            }
        })
    } 
    // else {
    //     $('.warning_label').append('<p>Enter an album or band name to search.</p>')
    //     $('#search_box').val() == '';
    // }
};