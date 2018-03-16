console.log("The custom script for the tag search page is running")

var selectedTags = $(".heres_the_selected_tags").text().split(",");
var cleanSelectedTags = [];
var matchingAlbums = [];

selectedTags.forEach(element => {
    element = element.trim();
    cleanSelectedTags.push(element);
});

function populateTagSearchResults() {
    // this is pulling data from url and checking the database
    $.getJSON ( '/search/tags/database/' + cleanSelectedTags, function(rawData) {

        if (typeof(rawData[0]) != "undefined") {           
            // iterate over results array
            rawData.forEach(element => {
                matchingAlbums.push(element.albumId);             
            });

            cleanSelectedTags.forEach(tagElement => {
                $('.tags_searched').append(`<span class="badge badge-primary">${tagElement}</span>  `);
            }); 

            matchingAlbums.forEach(element => {
                $.getJSON ( '/albumdetails/json/' + element, function(rawData) {
                    var album = rawData.data[0].attributes.name;
                    var release = rawData.data[0].attributes.copyright.slice(2, 6);
                    
                    $('.album_results').append(album, ' (', release, '): <a href="/albumdetails/' + element + '">Album Details</a> <br>');
                });
            });
        };
    });
};

populateTagSearchResults();
