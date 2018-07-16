// ------- START UTILITIES SECTION ----------
console.log("The custom script for the 'myfavorites' page is running.");


function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function hideDOMelement(elementId) {
    try {
        let element = document.getElementById(elementId)
        element.style.display = "none";
    } catch (error) {
        // this element does not exist here
    }
}

function showDOMelement(elementId) {
    try {
        let element = document.getElementById(elementId)
        element.style.display = "block";
    } catch (error) {
        // this element does not exist here
    }
}

function replaceUnderscoreWithBackSlash(str) {
    return str.replace(/_/g, "/");
};

function replaceSpaceWithUnderscore(str) {
    return str.replace(/ /g,"_");
}

function replaceSepecialCharacters(str) {
    return str.replace(/[^\w\s]/gi, '');
}

function isGenre(str) {
    if(str == 'Metalcore') {
        return true
    } else if(str == 'Pop Punk') {
        return true
    } else if(str == 'Emo') {
        return true
    } else if(str == 'Rock') {
        return true
    } else if(str == 'Post-Hardcore') {
        return true
    } else {
        return false
    }
}

function removeDuplicates(inputArray){
    let outputArray = []
    for(let i = 0;i < inputArray.length; i++){
        if(outputArray.indexOf(inputArray[i]) == -1){
            outputArray.push(inputArray[i])
        }
    }
    return outputArray
}

function removeElementFromArray(array, element){
    if (array.indexOf(element) != -1) {
        array.splice(array.indexOf(element), 1)
    }
}

function truncate(str, len){
    // set up the substring
    var subString = str.substr(0, len-1);
    
    return (
        // add elipse after last complete word
        subString.substr(0, subString.lastIndexOf(' '))
        // trim trailing comma
        .replace(/(^[,\s]+)|([,\s]+$)/g, '') + '...'
    )
};

// ------- END UTILITIES SECTION ----------


function getAlbumInfo(albumNumber, cardNumber) {
    
    $.getJSON( '/favorites/album/' + albumNumber)
    .done(function(rawData) {     
    // send album info to populateCard
    try {
        populateCard(albumNumber, rawData.data[0].attributes, cardNumber);
    } catch (error) {
        console.log(albumNumber, error)

        function logError() {
            var newKey = firebase.database().ref().child('errors').push().key;
        
            firebase.database().ref('errors/' + newKey).update({
            // firebase.database().ref('errors/').set({
                "error" : 
                {
                    "Album_Number" : albumNumber,
                    "User" : userID,
                    "URL" : window.location.href,
                    "Date_Time" : new Date().toLocaleString(),
                    "Error" : JSON.stringify(error, Object.getOwnPropertyNames(error))
                }
                // "error" : "No errors!"
            });
        
            // return firebase.database().ref('/errors').once('value').then(function(snapshot) {
            //     var error = snapshot.val();
            //     console.log(error)
            // });
        }

        logError()
        
        // newrelic.setCustomAttribute("Page_Load_Error", "Album_number_may_no_longer_be_valid")

        let emptyCard = document.getElementById(`card${cardNumber}`)
        emptyCard.remove();
    }

    // Ben's Suggestions if performance is still lagging:
    // try fetch, https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    // note: make sure to handle successful case and rejected case
    })
    .fail(function() { 
        console.log("error accessing Apple API");
    });
};

function createCard(cardNumber) {
    $('#all_cards').append(`<div id="card${cardNumber}" class="card albumCard"><a class="album_details_link" href=""><img class="card-img-top" src="" alt=""><a/><div class="card-body"><h4 class="card-title"></h4><span class="album"><span class="text-primary">Loading Album Details...</span></span></div></div>`);
}


function populateCard(albumNumber, results, cardNumber) {
    // set up album and artist trunction
    let smallArtist = results.artistName;
    let largeArtist = results.artistName;
    let smallAlbum = results.name;
    let largeAlbum = results.name;
    if (smallArtist.length > 32) { smallArtist = truncate(smallArtist, 32) } 
    if (smallAlbum.length > 44) { smallAlbum = truncate(smallAlbum, 44) } 

    if (largeArtist.length > 49) { largeArtist = truncate(largeArtist, 49) } 
    if (largeAlbum.length > 66) { largeAlbum = truncate(largeAlbum, 66) }
    
    // artist name
    $(`#card${cardNumber} .card-body h4`).html(`<span class="large_artist">${largeArtist}</span><span class="small_artist">${smallArtist}</span>`);
    // album name
    $(`#card${cardNumber} .card-body .album`).html(`<span class="large_album">${largeAlbum}</span><span class="small_album">${smallAlbum}</span>`); 
    // add release year to card div as a class: year-YYYY
    $(`#card${cardNumber}`).addClass(`year-${results.releaseDate.slice(0,4)}`);
    // add artist to card div as: artist-NAME
    $(`#card${cardNumber}`).addClass(`artist-${replaceSpaceWithUnderscore(replaceSepecialCharacters(results.artistName))}`);

    
    for (let index = 0; index < results.genreNames.length; index++) {
        let appleGenre = results.genreNames[index];

        if(notMyGenres.indexOf(appleGenre) == -1){
            $(`#card${cardNumber}`).addClass(`genre-${replaceSpaceWithUnderscore(appleGenre)}`);
        }
    }
    
    // album cover
    $(`#card${cardNumber} img`).attr(
        'src', results.artwork.url.replace('{w}', 350).replace('{h}', 350));
    // add album-details-link to album cover
    $(`#card${cardNumber} .album_details_link`).attr(
        'href', `/albumdetails/${albumNumber}`);

    // add to list of years to filter by 
    yearsList.push(`${results.releaseDate.slice(0,4)}`);
    appleGenreList.push(results.genreNames);
    artistsList.push(results.artistName);
};

// ----- START FIREBASE FAVORITES SECTION ------
var myFavoriteAlbums;

function updateFavoriteAlbums() {
    var favoritesRefrence = favoritesDatabase.ref().child(userID + "/My Favorites");
    favoritesRefrence.on('value', snap => {
        myFavoriteAlbums = snap.val() || [];

        startFavoritesPage();
    });
}
// ----- END FIREBASE FAVORITES SECTION ------



// ----------- START FILTERING FUNCTIONALITY --------------
var filterYear ='none';
var filterGenre ='none';
var filterArtist = 'none';
var filterTopTen = false;
var albumCardsList;
var yearsList = [];
var appleGenreList = [];
var yearsOnPage = [];
var artistsList = [];

function masterFilter(classToFilter) {
    if(classToFilter != 'none') {
        for (let index = 0; index < albumCardsList.length; index++) {
            let thisCard = albumCardsList[index];
            if(!$(thisCard).hasClass(classToFilter)) { thisCard.style.display = "none"; }
        }
    }
}

function restoreCards() {
    for (let index = 0; index < albumCardsList.length; index++) {
        albumCardsList[index].style.display = "inline";
    }
}

function clearFilters() {
    filterYear = 'none';
    filterGenre = 'none';
    filterArtist = 'none';
    if (filterTopTen == true) {
        toggleStar();
    }
    restoreCards();
}

// closes filter dropdown menu's when page is scrolling
$(document).on( 'scroll', function(){
    $('#year_filter_menu').removeClass('show');
    $('#genre_filter_menu').removeClass('show');
    // $('#artist_filter_menu').removeClass('show');
});



// ------------------ START YEARS FILTERS --------------------

// this populates the years the user can filter by in the dropdown
function buildYearFilters() {
    yearsList = removeDuplicates(yearsList);
    yearsList.sort();

    // clear everythig in list
    $('#year_filter_menu').html("");
    // add each year to list
    for (let index = 0; index < yearsList.length; index++) {
        let year = yearsList[index];
        if(filterYear == `year-${year}`){
            $('#year_filter_menu').append(`<a id="year-${year}" class="badge badge-primary year_to_filter_by" href="#" onclick="filterByYear(${year})">${year}</a>`)
        } else {
            $('#year_filter_menu').append(`<a id="year-${year}" class="badge badge-light year_to_filter_by" href="#" onclick="filterByYear(${year})">${year}</a>`)
        }
    }  
};

function filterByYear(year) {
    if(document.getElementById(`year-${year}`).classList.contains("badge-primary")){
        filterYear = 'none';
    } else {
        filterYear = `year-${year}`;
    }
    
    restoreCards();
    masterFilter(filterGenre);
    masterFilter(filterYear);
    masterFilter(filterArtist);
    filterByTopTen(filterTopTen)
};
// ------------------ END YEARS FILTERS --------------------



// ------------------ START GENRE FILTERS --------------------
var genresList = [];

// this populates the Tags card with any tags stored in the mongodb database
// and retrieved by the router stored at the URL listed with the album number
function getGenreTags(albumNumber, cardNumber) {
    $.getJSON ( '/albumdetails/newtags/database/' + albumNumber, function(rawData) {
        if (typeof(rawData[0]) != "undefined") {

            var tags = rawData[0].tags;
            var authors = rawData[0].createdBy;

            for (let index = 0; index < tags.length; index++) {
                var tag = tags[index];
                tag = replaceUnderscoreWithBackSlash(tag);

                if(isGenre(tag) == true){             
                    
                    // add genre as a class on the card
                    $(`#card${cardNumber}`).addClass(`genre-${replaceSpaceWithUnderscore(tag)}`);
                    genresList.push(tag);
                } else if (tag == "Top 10") {
                    // using for top 10 functionality later
                    $("#top_10_button").show();
                    $(`#card${cardNumber}`).addClass("Top_10");
                } else {
                    // none of these tags are genres
                }
            };
        };
    });
};

var notMyGenres = ["Music", "Adult Alternative", "CCM", "Christian & Gospel", "Christian Rock", "College Rock", "Hard Rock", "Punk"]

function buildGenreFilters() {

    // flatten array and remove duplicates
    appleGenreList = removeDuplicates(appleGenreList.reduce((a, b) => a.concat(b), []));
    for (let index = 0; index < notMyGenres.length; index++) {
        let genre = notMyGenres[index];
        removeElementFromArray(appleGenreList,genre)
    }

    genresList = removeDuplicates(genresList.concat(appleGenreList));
    genresList.sort();

    // clear everythig in list
    $('#genre_filter_menu').html("");
    // add each genre to list
    for (let index = 0; index < genresList.length; index++) {
        let genre = genresList[index];
        if(filterGenre == `genre-${replaceSpaceWithUnderscore(genre)}`) {
            $('#genre_filter_menu').append(`<a id="genre-${replaceSpaceWithUnderscore(genre)}" class="badge badge-primary genre_to_filter_by" href="#" onclick="filterByGenre('${genre}')">${genre}</a>`);
        } else {
            $('#genre_filter_menu').append(`<a id="genre-${replaceSpaceWithUnderscore(genre)}" class="badge badge-light genre_to_filter_by" href="#" onclick="filterByGenre('${genre}')">${genre}</a>`);
        }       
    }  
};

function filterByGenre(genre){
    if(document.getElementById(`genre-${replaceSpaceWithUnderscore(genre)}`).classList.contains("badge-primary")){
        filterGenre = 'none';
    } else {
        filterGenre = `genre-${replaceSpaceWithUnderscore(genre)}`;
    }

    restoreCards();
    masterFilter(filterGenre);

    masterFilter(filterYear);
    masterFilter(filterArtist);
    filterByTopTen(filterTopTen)
}

function startTags() {
    if (myFavoriteAlbums.length != 0) {
        for (let index = 0; index < myFavoriteAlbums.length; index++) {
            let album = myFavoriteAlbums[index];
            let card = (index + 1)
            getGenreTags(album, card);   
        }
    }    
}
// ------------------ END GENRE FILTERS --------------------


// ------------------ START ARTIST FILTERS --------------------
function buildArtistFilters() {
    artistsList = removeDuplicates(artistsList);
    artistsList.sort();

    // clear everythig in list
    $('#artist_filter_menu').html("");
    // add each artist to list
    for (let index = 0; index < artistsList.length; index++) {
        let artist = artistsList[index];
        if (artist.length > 40) { artist = truncate(artist, 32) }

        let cleanArtist = replaceSpaceWithUnderscore(replaceSepecialCharacters(artist));
        cleanArtist = replaceSpaceWithUnderscore(cleanArtist)

        if(filterArtist == `artist-${cleanArtist}`){
            $('#artist_filter_menu').append(`<a id="artist-${cleanArtist}" class="badge badge-primary artist_to_filter_by" href="#" onclick="filterByArtist('${cleanArtist}')">${artist}</a>`)
        } else {
            $('#artist_filter_menu').append(`<a id="artist-${cleanArtist}" class="badge badge-light artist_to_filter_by" href="#" onclick="filterByArtist('${cleanArtist}')">${artist}</a>`)
        }
    }  
};

function filterByArtist(artist) {
    let cleanArtist = replaceSepecialCharacters(artist);
    cleanArtist = replaceSpaceWithUnderscore(cleanArtist)

    if(document.getElementById(`artist-${cleanArtist}`).classList.contains("badge-primary")){
        filterArtist = 'none';
    } else {
        filterArtist = `artist-${cleanArtist}`;
    }
    
    restoreCards();
    masterFilter(filterGenre);
    masterFilter(filterYear);
    masterFilter(filterArtist);
    filterByTopTen(filterTopTen)
};
// ------------------ END ARTIST FILTERS --------------------


// ------------------ START TOP 10 FILTERS --------------------
function toggleStar() {
    if($("#top_star_full").is(":visible")){
        $("#top_star_full").hide()
        $("#top_star_empty").show()
        filterTopTen = false
    } else {
        $("#top_star_full").show()
        $("#top_star_empty").hide() 
        filterTopTen = true
    }
}

function selectTopTen() {
    toggleStar();

    restoreCards();
    masterFilter(filterGenre);
    masterFilter(filterYear);
    masterFilter(filterArtist);
    filterByTopTen(filterTopTen)
}

function filterByTopTen(classToFilter) {
    if(classToFilter != false) {
        for (let index = 0; index < albumCardsList.length; index++) {
            let thisCard = albumCardsList[index];
            if(!$(thisCard).hasClass("Top_10")) { thisCard.style.display = "none"; }
        }
    }
};
// ------------------ END TOP 10 FILTERS --------------------

// ----------- END FILTERING FUNCTIONALITY --------------



function startFavoritesPage() {
    // clear any warnings
    $('#all_cards').html("");
    // display instructions if no favorites exist for this user
    if (myFavoriteAlbums.length == 0) {
        showDOMelement("log_in_message")
        $('#log_in_message').html("<div style='text-align:center;margin: 20px 0px 50px 0px;'><p>Looks like you don't have any favorites yet!</p><p><a href='/search'>Search</a> for albums and use the <img src='../images/heart-unliked.png' height='30' width='auto'> icon to add them to your favorites.</p></div>");
        hideDOMelement("filter_by_genre_dropdown_button");
        hideDOMelement("filter_by_year_dropdown_button");
        hideDOMelement("filter_by_artist_dropdown_button");
        hideDOMelement("clear_filters_button");
        hideDOMelement("to_top_button");
    } else {
        $('#log_in_message').html("");
    }
    // create card and populate for each favorite album
    for (let index = 0; index < myFavoriteAlbums.length; index++) {
        let album = myFavoriteAlbums[index].albumId;
        let card = (index + 1);
        
        createCard(card)
        getAlbumInfo(album, card) 
    }
    // populate our list of dom elements for filtering 
    albumCardsList = $(".albumCard");
    startTags();
};

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



// ======= RUN THIS FUNCTION WHILE LOGGED IN TO UPDATE DATABASE =======
console.log('Run startFavoritesUpdate() to update the datastructure of your favorites!')
function startFavoritesUpdate() {
    for (let index = 0; index < myFavoriteAlbums.length; index++) {
        let albumID = myFavoriteAlbums[index];
        
        let newFavorite
        let artist
        let album
        $.getJSON ( '/albumdetails/json/' + albumID, function(rawData) {
            artist = rawData.data[0].attributes.artistName;
            album = rawData.data[0].attributes.name;
        }).then(function(){
            newFavorite = 
            {
                "albumId" : albumID,
                "artistName" : artist,
                "albumName" : album
            }
        }).then(function() {
            let index = myFavoriteAlbums.indexOf(albumID);
            myFavoriteAlbums.splice(index, 1);
            myFavoriteAlbums.push(newFavorite);
        }).then(function() {
            favoritesDatabase.ref(userID).set({
                "My Favorites": myFavoriteAlbums
            });
        })
    }
}