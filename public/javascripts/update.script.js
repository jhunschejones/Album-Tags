// ---------- BEGIN UTILITIES ------------
console.log('The custom script for the update page is running');

function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

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

// ---------------- END UTILITIES ---------------


// This is really messy, but the album Id is stored in the ejs file in a hidden 
// element. It comes in as a string so I'm converting it to a number to use in
// my logic below
var albumId = $(".heres_the_album_id").text();
albumId = parseInt(albumId);
var currentTags = [];
var currentAuthors = [];
var tagsForThisAlbum
var totalAuthors


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
        // $('.albumdetails_album').append(album, '<br>');
        $('.albumdetails_album').append(`<span id="the_album_name" data-toggle="tooltip" data-placement="right" title="Click to Show Album ID" data-trigger="hover" onclick="showAlbumID()" style="cursor:pointer;">${album}</span><span id="the_album_id" class="text-secondary" data-toggle="tooltip" data-placement="right" title="Select & Copy Album ID" data-trigger="hover" style="display:none;">${albumId}</span>`);
        $('.albumdetails_details img').attr("src", cover, '<br');
        // adding path to apple music to button
        $('.applemusicurl').attr("href", applemusicurl, '<br>');
        $('.albumdetails_label').append(label, '<br>');
        $('.albumdetails_release').append(release, '<br>');
    });
};


// this populates the Tags card with any tags stored in the mongodb database
// and retrieved by the router stored at the URL listed with the album number
function populateTags(reason) {
    var noAuthors = false

    // console.log("populate tags called")
    $.getJSON ( '/albumdetails/database/' + albumId, function(rawData) {
        if (typeof(rawData[0]) != "undefined") {
            $('.tag_results').text('');
            currentTags = [];
            currentAuthors = [];
            var tags = rawData[0].tags;
            var authors = rawData[0].createdBy;

            for (let index = 0; index < tags.length; index++) {
                var element = tags[index];
                var author;

                // correcting for old authors structure
                try {
                    author = authors[index];
                    if (author == "Joshua Jones") {
                        author = "Ol5d5mjWi9eQ7HoANLhM4OFBnso2";
                    }
                } catch (error) {
                    // error should only fire on older structures where there is no author field
                    // these tags were all added by me origionally when the data structure was 
                    // simpler
                    author = "Ol5d5mjWi9eQ7HoANLhM4OFBnso2";
                    noAuthors = true
                }

                element = replaceUnderscoreWithBackSlash(element);
                currentTags.push(element);
                currentAuthors.push(author);

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
                $('.tag_results').append(`<tr class="album_details_tags update_tags author-${author}"><td>${element}</td><td><a href="#" class="deletetaglink" rel="${element}">Delete</a></td></tr>`);  
                // console.log(element)             
            }
            $(".update_tags").hide();
        } else {
            // create database entry if none exists
            postTags(); 
        };
    }).then(function(){
        if (noAuthors == true) {
            correctAuthors();
        }
        tagsForThisAlbum = $(".update_tags")
        for (let index = 0; index < tagsForThisAlbum.length; index++) {
            let thisTag = tagsForThisAlbum[index];
    
            if($(thisTag).hasClass(`author-${userID}`)) {
                // console.log("tag belongs to this author")
                $(thisTag).show()
            } else {
                // console.log("tag does not belong to this author")
                $(thisTag).hide()
            }
        }
    }).then(function() {
        if (reason == "add" & currentAuthors.length != (totalAuthors + 1)){
            // console.log("Repeating function to add")
            populateTags("add");
        } else if (reason == "delete" & currentAuthors.length != (totalAuthors - 1)){
            // console.log("Repeating function to delete")
            populateTags("delete");
        } else {
            // this is not a request to update or delete a tag, do not re-run the function
        }
    })
};


function correctAuthors() {
    currentAuthors = []
    for (let index = 0; index < currentTags.length; index++) {

        currentAuthors.push("Ol5d5mjWi9eQ7HoANLhM4OFBnso2")
    }

    // Use AJAX to put the new tag in the database   
    $.ajax(`database/${albumId}`, {
        method: 'PUT',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify({"tags" : currentTags, "createdBy" : currentAuthors})
    })
}

function addTag() {
    event.preventDefault();
    totalAuthors = currentAuthors.length

    if ($('#new_tag').val()) {
        var newTag = $('#new_tag').val();
        newTag = removeExtraSpace(toTitleCase(replaceBackSlashWithUnderscore(newTag))).trim();
        var newAuthor = userID;

        // correcting for old authors structure
        for (let index = 0; index < currentAuthors.length; index++) {
            let a = currentAuthors[index];
            if (a == "Joshua Jones") {
                currentAuthors[index] = 'Ol5d5mjWi9eQ7HoANLhM4OFBnso2'
            }
        }

        // checking for duplicates
        if (currentTags.indexOf(newTag) == -1) {
            currentTags.push(newTag);
            currentAuthors.push(newAuthor);
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
            data: JSON.stringify({"tags" : currentTags, "createdBy" : currentAuthors})
        }).then(populateTags("add"))
    } else {
        $(".warning_label").text("Please enter a non-empty tag.")
    } 

    $('#new_tag').val('');
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


function deleteTag(event) {
    event.preventDefault();
    var confirmation = confirm('Are you sure you want to delete a tag?');

    if (confirmation === true) {
        totalAuthors = currentAuthors.length

        var index = currentTags.indexOf($(this).attr('rel'))
        currentTags.splice(index, 1);
        currentAuthors.splice(index, 1);

        $.ajax(`database/${albumId}`, {
            method: 'PUT',
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify({"tags" : currentTags, "createdBy" : currentAuthors})
        }).then(populateTags("delete"))
    }
};


function postTags() {

    // Use AJAX to post the new tag in the database   
    $.ajax(`database/${albumId}`, {
        method: 'POST',
        contentType: 'application/json',
        processData: false,
        // have to convert albumId to string so it works with the rest of app logic
        data: JSON.stringify({"albumId" : albumId.toString(), "tags" : [], "createdBy" : []})
    })
};

// long functions called here, waiting for page to load before calling
// the api and database calls
$( document ).ready( function() {
    populateTable();
    populateTags("start");
})

// event listener called when enter is pressed with value in text form
$("form").submit(function (e) {
    e.preventDefault();
    addTag();
});

// event listener for clicking delete link
$('#tags_table tbody').on('click', 'td a.deletetaglink', deleteTag);

// ------------- start tooltips section -----------
var isTouchDevice = false

$(function () {
    if ("ontouchstart" in document.documentElement) {
        isTouchDevice = true
    }
    
    if(isTouchDevice == false) {
        $('[data-toggle="tooltip"]').tooltip()
    }
})
// combine with data-trigger="hover" in html element 
// for desired behavior
// -------------- end tooltips section --------------