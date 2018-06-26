// ------- START UTILITIES SECTION ----------
console.log("The custom script for the 'myfavorites' page is running.");

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
// ------- END UTILITIES SECTION ----------


function getAlbumInfo(albumNumber, cardNumber) {
    
    $.getJSON( '/favorites/album/' + albumNumber)
    .done(function(rawData) {     
    // send album info to populateCard
    populateCard(albumNumber, rawData.data[0].attributes, cardNumber);
    // Commented out list functionality:
    // populateList(albumNumber, rawData.data[0].attributes);

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
    
    // artist name
    $(`#card${cardNumber} .card-body h4`).html(
        results.artistName);
    // album name
    $(`#card${cardNumber} .card-body .album`).html(
        ' ' + results.name); 
    // add release year to card div as a class: year-YYYY
    $(`#card${cardNumber}`).addClass(`year-${results.releaseDate.slice(0,4)}`);
    
    for (let index = 0; index < results.genreNames.length; index++) {
        let appleGenre = results.genreNames[index];

        if(notMyGenres.indexOf(appleGenre) == -1){
            $(`#card${cardNumber}`).addClass(`genre-${appleGenre}`);
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
};

// ----- START FIREBASE FAVORITES SECTION ------
var myFavoriteAlbums;

function updateFavoriteAlbums() {
    dbRefrence = firebase.database().ref().child(userID + "/My Favorites");
    dbRefrence.on('value', snap => {
        myFavoriteAlbums = snap.val() || [];
        myFavoriteAlbums.sort();
        startFavoritesPage();
    });
}
// ----- END FIREBASE FAVORITES SECTION ------



// ----------- START FILTERING FUNCTIONALITY --------------
var filterYear ='none';
var filterGenre ='none';
var albumCardsList;
var yearsList = [];
var appleGenreList = [];
var yearsOnPage = [];

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
};

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
    restoreCards();
}

// closes year filter dropdown menu when page is scrolling
$(document).on( 'scroll', function(){
    $('#year_filter_menu').removeClass('show');
});

// ---------------------------
// ------- TAGS START --------
// ---------------------------

function changeClass(elementId) {
    let tag = document.getElementById(elementId);
    tag.classList.toggle("badge-primary");
    tag.classList.toggle("badge-light");
};

var genresList = [];

// this populates the Tags card with any tags stored in the mongodb database
// and retrieved by the router stored at the URL listed with the album number
function getGenreTags(albumNumber, cardNumber) {
    $.getJSON ( '/albumdetails/database/' + albumNumber, function(rawData) {
        if (typeof(rawData[0]) != "undefined") {

            var tags = rawData[0].tags;
            var authors = rawData[0].createdBy;

            for (let index = 0; index < tags.length; index++) {
                var tag = tags[index];
                tag = replaceUnderscoreWithBackSlash(tag);

                if(isGenre(tag) == true){             
                    
                    // add genre as a class on the card
                    $(`#card${cardNumber}`).addClass(`genre-${tag}`);
                    genresList.push(tag);
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
        if(filterGenre == `genre-${genre}`) {
            $('#genre_filter_menu').append(`<a id="genre-${genre}" class="badge badge-primary genre_to_filter_by" href="#" onclick="filterByGenre('${genre}')">${genre}</a>`);
        } else {
            $('#genre_filter_menu').append(`<a id="genre-${genre}" class="badge badge-light genre_to_filter_by" href="#" onclick="filterByGenre('${genre}')">${genre}</a>`);
        }       
    }  
};

function filterByGenre(genre){
    if(document.getElementById(`genre-${genre}`).classList.contains("badge-primary")){
        filterGenre = 'none';
    } else {
        filterGenre = `genre-${genre}`;
    }

    restoreCards();
    masterFilter(filterGenre);
    masterFilter(filterYear);
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

// ---------------------------
// -------- TAGS END ---------
// ---------------------------

// ----------- END FILTERING FUNCTIONALITY --------------


function startFavoritesPage() {
    // clear any warnings
    $('#all_cards').html("");
    // display instructions if no favorites exist for this user
    if (myFavoriteAlbums.length == 0) {
        $('#log_in_message').html("<div style='text-align:center;margin: 20px 0px 50px 0px;'><p>Looks like you don't have any favorites yet!</p><p><a href='/search'>Search</a> for albums and use the <img src='../images/heart-unliked.png' height='30' width='auto'> icon to add them to your favorites.</p></div>");
        hideDOMelement("filter_by_genre_dropdown_button");
        hideDOMelement("filter_by_year_dropdown_button");
        hideDOMelement("clear_filters_button");
    } else {
        $('#log_in_message').html("");
    }
    // create card and populate for each favorite album
    for (let index = 0; index < myFavoriteAlbums.length; index++) {
        let album = myFavoriteAlbums[index];
        let card = (index + 1);
        
        createCard(card)
        getAlbumInfo(album, card) 
    }
    // populate our list of dom elements for filtering 
    albumCardsList = $(".albumCard");
    startTags();
};

// an unordered list of albums, for smaller screens or longer lists.
// this works, I'm just not using it right now
// function populateList(albumNumber, results) {
//     $('.album_list').append(`<li><a href="/albumdetails/${albumNumber}"><img src="${results.artwork.url.replace('{w}', 30).replace('{h}', 30)}">&nbsp; ${results.name}</a> <span class="text-secondary font-italic">- ${results.artistName}</span></li>`);
// };
