// -------- START UTILITIES SECTION --------

console.log("The custom script for the album details page is running")



function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

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

// takes a string thats an html element ID
function toggleDOMelement(content) {
    
    let query = $(`#${content}`); 
    // check if element is Visible
    var isVisible = query.is(':visible');
    
    if (isVisible === true) {
        // element was Visible
        query.hide();
    } else {
        // element was Hidden
        query.show();
    }
}


function toggleContentAndArrows(content, up, down) {
    
    let query = $(`#${content}`); 
    let downArrow = $(`#${down}`); 
    let upArrow = $(`#${up}`); 

    // check if element is Visible
    var isVisible = query.is(':visible');
    
    if (isVisible === true) {
        // element was Visible
        query.css( "display", "none" );
        downArrow.css( "display", "block" );
        upArrow.css( "display", "none" );
    } else {
        // element was Hidden
        query.css( "display", "block" );
        downArrow.css( "display", "none" );
        upArrow.css( "display", "block" );
    }
}

function toggleTracksAndArrows(content, up, down) {
    
    let query = $(`#${content}`); 
    let downArrow = $(`#${down}`); 
    let upArrow = $(`#${up}`); 

    // check if element is Visible
    var isVisible = query.is(':visible');
    
    if (isVisible === true) {
        // element was Visible
        query.css( "display", "none" );
        downArrow.css( "display", "inline-block" );
        upArrow.css( "display", "none" );
    } else {
        // element was Hidden
        query.css( "display", "inline-block" );
        downArrow.css( "display", "none" );
        upArrow.css( "display", "inline-block" );
    }
}

// -------- END UTILITIES SECTION --------


// This is really messy, but the album Id is stored in the ejs file in a hidden 
// element. It comes in as a string so I'm converting it to a number to use in
// my logic below
var albumId = $(".heres_the_album_id").text();
albumId = parseInt(albumId);
var tagsForThisAlbum;


// this populates the page with all the details
function populateAlbumDetails(albumNumber){

    $.getJSON ( '/albumdetails/json/' + albumNumber, function(rawData) {
        var artist = rawData.data[0].attributes.artistName;
        var album = rawData.data[0].attributes.name;
        var label = rawData.data[0].attributes.recordLabel;
        // the replaceing at the end here is setting the width and height of the image
        var cover = rawData.data[0].attributes.artwork.url.replace('{w}', 450).replace('{h}', 450);
        var applemusicurl = rawData.data[0].attributes.url;
        // calling my makeNiceDate function from below to format the date
        var release = makeNiceDate(rawData.data[0].attributes.releaseDate);
        
        var songObjectArray = rawData.data[0].relationships.tracks.data;
        var songNames = [];

        for (let index = 0; index < songObjectArray.length; index++) {
            let element = songObjectArray[index];
            songNames.push(element.attributes.name);
        }

        $('.albumdetails_details img').attr("src", cover, '<br');
        $('.albumdetails_artist').append(artist);
        $('.albumdetails_artist').append(`<img src="../images/heart-unliked.png" height="30" width="auto" id="add_to_favorites" class="hide_when_logged_out" style="display:none;cursor:pointer;" onclick="addToFavoriteAlbums(${albumNumber})" data-toggle="tooltip" title="Add To Favorites">`)
        $('.albumdetails_artist').append(`<img src="../images/heart-liked.png" height="30" width="auto" id="remove_from_favorites" class="hide_when_logged_out" style="display:none;cursor:pointer;" onclick="removeFromFavorites(${albumNumber})" data-toggle="tooltip" title="Remove From Favorites">`)
        // $('.albumdetails_album').append(album, '<br/>');
        $('.albumdetails_album').append(`<span id="the_album_name" data-toggle="tooltip" data-placement="right" title="Click to Show Album ID" data-trigger="hover" onclick="showAlbumID()" style="cursor:pointer;">${album}</span><span id="the_album_id" class="text-secondary" data-toggle="tooltip" data-placement="right" title="Select & Copy Album ID" data-trigger="hover" style="display:none;">${albumId}</span>`);

        // adding path to apple music to button
        $('.applemusicurl').attr("href", applemusicurl, '<br>');
        $('.albumdetails_label').append(label, '<br>');
        $('.albumdetails_release').append(release, '<br>');
        
        songNames.forEach(element => {
            $('.song_names').append(`<li>${element}</li>`);
        });
        
    });
};

function showAlbumID() {
   showDOMelement("the_album_id")
   hideDOMelement("the_album_name")
   setTimeout(showAlbumName, 7000)
}

function showAlbumName() {
    showDOMelement("the_album_name")
    hideDOMelement("the_album_id")
}

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
    var noAuthors = false

    $.getJSON ( '/albumdetails/database/' + albumNumber, function(rawData) {
        if (typeof(rawData[0]) != "undefined") {
            // clear default no-tags notice if tags exist
            $(".tag_results").text('');
            $(".tag_search_button").html('<a href="" onclick="tagSearch()" class="btn btn-sm btn-outline-primary tag_search_button hide_when_logged_out" style="display:none;">Search by Selected Tags</a>');
            var tags = rawData[0].tags;
            var authors = rawData[0].createdBy;

            // hide entire tags box if no tags exist
            if (tags.length < 1) {
                $('.tags_card').hide();
            } else {
                for (let index = 0; index < tags.length; index++) {
                    var element = tags[index];
                    var author;
    
                    try {
                        author = authors[index];
                        if (author == "Joshua Jones") {
                            author = "Ol5d5mjWi9eQ7HoANLhM4OFBnso2";
                        }
                    } catch (error) {
                        // error should only fire on older structures where there is no author field
                        author = "Ol5d5mjWi9eQ7HoANLhM4OFBnso2";
                    }
             
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
                    $('.tag_results').append(`<a href="" onclick="changeClass(${tagName})" id="${tagName}" class="badge badge-light album_details_tags author-${author}">${element}</a>  `);               
                }
                $('.album_details_tags').hide();
            }  
        }
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

// This section handles favorite albums functionality
var myFavoriteAlbums;

function updateFavoriteAlbums() {
    dbRefrence = firebase.database().ref().child(userID + "/My Favorites");
    dbRefrence.on('value', snap => {
        // if value is null, this makes myFavoriteAlbums an empty string
        myFavoriteAlbums = snap.val() || [];
        checkForDuplicates();
    });
}

function checkForDuplicates() {  
    if (myFavoriteAlbums.indexOf(albumId) == -1) {
        remove_from_favorites.style.display = "none";
        add_to_favorites.style.display = "inline";
    } else {
        add_to_favorites.style.display = "none";
        remove_from_favorites.style.display = "inline";
    }
}

function addToFavoriteAlbums(newAlbum) {
    // console.log("add to favorite albums called")

    myFavoriteAlbums.push(newAlbum);


    updateDatabase();
    checkForDuplicates();
}

function removeFromFavorites(newAlbum) {
    let index = myFavoriteAlbums.indexOf(newAlbum);
    myFavoriteAlbums.splice(index, 1);
    updateDatabase();
    checkForDuplicates();
}

function updateDatabase() {
    // console.log("update database called")
    firebase.database().ref(userID).set({
        "My Favorites": myFavoriteAlbums
    });
}



// waiting for the page to be ready before filling content
// decide if this looks better than just calling functions
// $( document ).ready(function(){
    // calling populateAlbumDetails and populateTags to fill the page
    populateAlbumDetails(albumId);
    populateTags(albumId);
    // populate our list of dom elements for filtering 
// });

// called by the search button on tags card
function tagSearch() {
    event.preventDefault();

    if (selectedTags.length > 0) {
        var win = window.location = (`/search/tags/${selectedTags}`);
    }  else {
        $('.warning_label').html('');
        $('.warning_label').html('<br/>Select one or more tags to preform a tag-search.');
    }
};
