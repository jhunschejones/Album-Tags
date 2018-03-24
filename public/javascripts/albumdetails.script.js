console.log("The custom script for the album details page is running")

// This is really messy, but the album Id is stored in the ejs file in a hidden 
// element. It comes in as a string so I'm converting it to a number to use in
// my logic below
var albumId = $(".heres_the_album_id").text();
albumId = parseInt(albumId);


// this populates the page with all the details
function populateAlbumDetails(albumNumber){

    $.getJSON ( '/albumdetails/json/' + albumNumber, function(rawData) {
        var artist = rawData.data[0].attributes.artistName;
        var album = rawData.data[0].attributes.name;
        var label = rawData.data[0].attributes.recordLabel;
        // the replaceing at the end here is setting the width and height of the image
        var cover = rawData.data[0].attributes.artwork.url.replace('{w}', 500).replace('{h}', 500);
        var applemusicurl = rawData.data[0].attributes.url;
        // calling my makeNiceDate function from below to format the date
        var release = makeNiceDate(rawData.data[0].attributes.releaseDate);

        $('.albumdetails_details img').attr("src", cover, '<br');
        $('.albumdetails_artist').append(artist);
        $('.albumdetails_album').append(album, '<br>');

        // adding path to apple music to button
        $('.applemusicurl').attr("href", applemusicurl, '<br>');
        $('.albumdetails_label').append(label, '<br>');
        $('.albumdetails_release').append(release, '<br>');
    });
};

// I'm using this variable and function to reformat the date provided in Apple's API
// into a fully written-out and formated date
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function makeNiceDate(uglyDate) {
    let year = uglyDate.slice(0, 4);
    let day = uglyDate.slice(8, 10);
    let uglyMonth = uglyDate.slice(5, 7); 
    let niceMonth = months[uglyMonth-1];
    return(`${niceMonth} ${day}, ${year}`);
};

function replaceUnderscoreWithBackSlash(str) {
    return str.replace(/_/g, "/");
};

// this populates the Tags card with any tags stored in the mongodb database
// and retrieved by the router stored at the URL listed with the album number
function populateTags(albumNumber) {
    $.getJSON ( '/albumdetails/database/' + albumNumber, function(rawData) {
        if (typeof(rawData[0]) != "undefined") {
            // clear default no-tags notice if tags exist
            $(".tag_results").text('');
            $(".tag_search_button").html('<a href="" onclick="tagSearch()" class="btn btn-sm btn-outline-primary tag_search_button">Search by Selected Tags</a>');
            var tags = rawData[0].tags;

            tags.forEach(element => {
                element = replaceUnderscoreWithBackSlash(element)
                // creating a unique tag for each element, solving the problem of number tags not allowed
                // by adding some letters to the start of any tag that can be converted to a number
                // then using a regular expression to remove all spaces and special characters in each tag
                if (parseInt(element)) {
                    var addLetters = "tag_";
                    var tagName = addLetters.concat(element).replace(/[^A-Z0-9]+/ig,'');
                } else {                  
                    var tagName = element.replace(/[^A-Z0-9]+/ig,'');
                }

                // Here we add the tags as elements on the DOM, with an onclick function that uses a unique
                // tag to toggle a badge-success class name and change the color
                $('.tag_results').append(`<a href="" onclick="changeClass(${tagName})" id="${tagName}" class="badge badge-light">${element}</a>  `);               
            });
        };
    });
};


// this function is avaiable onclick for all the tags it will toggle
// between two boostrap classes to change the color of selected tags
// it takes in the unique tag ID assigned to eatch badge durring
// creation so that only the desired badge toggles colors
function changeClass(tagName) {
    event.preventDefault();
    // clear warning label
    $('.warning_label').text('');
    var thisTag = document.getElementById(tagName.id);
    thisTag.classList.toggle("badge-primary");
    thisTag.classList.toggle("selected_tag");
    thisTag.classList.toggle("badge-light");
    // see below
    addToTagArray(thisTag.innerHTML);
};


// this function creates an array and adds or removes tags as the
// applicable tag badges are clicked
var selectedTags = [];
function addToTagArray(tag) {
    // this conditional returns -1 value if tag is not in array
    if ($.inArray(tag, selectedTags) === -1) {
        selectedTags.push(tag);
    } else {
        // cant use pop because it removes last item only
        // this finds the item being clicked and uses that
        // index with splice() to remove 1 item only
        let index = selectedTags.indexOf(tag)
        selectedTags.splice(index, 1);
    };
};


// waiting for the page to be ready before filling content
// decide if this looks better than just calling functions
// $( document ).ready(function(){
    // calling populateAlbumDetails and populateTags to fill the page
    populateAlbumDetails(albumId);
    populateTags(albumId);
// });

// called by the search button on tags card
function tagSearch() {
    event.preventDefault();

    if (selectedTags.length > 0) {
        var win = window.location = (`/search/tags/${selectedTags}`);
    }  else {
        $('.warning_label').text('');
        $('.warning_label').text('Select one or more tags to preform a tag-search.');
    }
};
