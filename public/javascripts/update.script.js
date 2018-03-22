console.log('The custom script for the updte page is running');
// This is really messy, but the album Id is stored in the ejs file in a hidden 
// element. It comes in as a string so I'm converting it to a number to use in
// my logic below
var albumId = $(".heres_the_album_id").text();
albumId = parseInt(albumId);
var currentTags = [];


function populateTable() {
    $.getJSON ( '/albumdetails/json/' + albumId, function(rawData) {
        var artist = rawData.data[0].attributes.artistName;
        var album = rawData.data[0].attributes.name;
        var label = rawData.data[0].attributes.recordLabel;
        // the replaceing at the end here is setting the width and height of the image
        var cover = rawData.data[0].attributes.artwork.url.replace('{w}', 500).replace('{h}', 500);
        var applemusicurl = rawData.data[0].attributes.url;
        // calling my makeNiceDate function from below to format the date
        var release = makeNiceDate(rawData.data[0].attributes.releaseDate);
        
        $('.albumdetails_artist').append(artist);
        $('.albumdetails_album').append(album, '<br>');
        $('.albumdetails_details img').attr("src", cover, '<br');
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


// this populates the Tags card with any tags stored in the mongodb database
// and retrieved by the router stored at the URL listed with the album number
function populateTags() {
    $.getJSON ( '/albumdetails/database/' + albumId, function(rawData) {
        if (typeof(rawData[0]) != "undefined") {
            $('.tag_results').text('');
            currentTags = [];
            var tags = rawData[0].tags;

            tags.forEach(element => {

                element = replaceUnderscoreWithBackSlash(element);

                currentTags.push(element);
                // creating a unique tag for each element, solving the problem of number tags not allowed
                // by adding some letters to the start of any tag that can be converted to a number
                // then using a regular expression to remove all spaces in each tag
                if (parseInt(element)) {
                    var addLetters = "tag_";
                    var tagName = addLetters.concat(element).replace(/\s/g,'');
                } else {                  
                    var tagName = element.replace(/\s/g,'');
                }

                // Here we add the tags as elements on the DOM, with an onclick function that uses a unique
                // tag to toggle a badge-success class name and change the color
                $('.tag_results').append(`<tr><td>${element}</td><td><a href="#" class="deletetaglink" rel="${element}">Delete</a></td></tr>`);  
                console.log(element)             
            });
        } else {
            // create database entry if none exists
            postTags(); 
        };
    });
};

// using regular expression to make first letter of each
// word upper case, even if it is seperated with a "-"
function toTitleCase(str) {
    return str.replace(/\b\w+/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// removes accidental double spaces
function removeExtraSpace(str) {
    return str.replace(/\s\s+/g, ' ');
}

// replaces back slash with underscore
function replaceBackSlashWithUnderscore(str) {
    return str.replace(/\//g, '_');
}

function replaceUnderscoreWithBackSlash(str) {
    return str.replace(/_/g, "/");
};

function updateTags() {

    event.preventDefault();
    if ($('#new_tag').val()) {
        var newTag = $('#new_tag').val();
        newTag = removeExtraSpace(toTitleCase(replaceBackSlashWithUnderscore(newTag))).trim();

        // checking for duplicates
        if (currentTags.indexOf(newTag) == -1) {
            currentTags.push(newTag);
            $(".warning_label").text('')
        } 
        else {
            $(".warning_label").text("That tag is already assigned to this album.")
        };
        
    
        // Use AJAX to put the new tag in the database   
        $.ajax(`database/${albumId}`, {
            method: 'PUT',
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify({"tags" : currentTags})
        })
    } else {
        $(".warning_label").text("Please enter a non-empty tag.")
    } 

    populateTags();
    $('#new_tag').val('');
};

function deleteTag(event) {
    event.preventDefault();
    var confirmation = confirm('Are you sure you want to delete a tag?');

    if (confirmation === true) {
        var index = currentTags.indexOf($(this).attr('rel'))
        currentTags.splice(index, 1);
        // currentTags.filter(e => e !== $(this).attr('rel'));

        $.ajax(`database/${albumId}`, {
            method: 'PUT',
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify({"tags" : currentTags})
        })

        populateTags();
    }
};


function postTags() {

    // Use AJAX to post the new tag in the database   
    $.ajax(`database/${albumId}`, {
        method: 'POST',
        contentType: 'application/json',
        processData: false,
        // have to convert albumId to string so it works with the rest of app logic
        data: JSON.stringify({"albumId" : albumId.toString(), "tags" : []})
    })
};

// long functions called here, waiting for page to load before calling
// the api and database calls
$( document ).ready( function() {
    populateTable();
    populateTags();
})

// event listener called when enter is pressed with value in text form
$("form").submit(function (e) {
    e.preventDefault();
    updateTags();
});

// event listener for clicking delete link
$('#tags_table tbody').on('click', 'td a.deletetaglink', deleteTag);

// any time page is clicked, call populate tags at 500 and 2000ms
// this accounts for lag in database and makes sure table is updated
$( document ).click(function () {
    setTimeout(populateTags, 500);
    setTimeout(populateTags, 2000);
});