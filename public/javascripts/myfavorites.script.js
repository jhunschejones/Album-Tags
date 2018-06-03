// ------- START UTILITIES SECTION ----------
console.log("The custom script for the 'myfavorites' page is running.");

function hideDOMelement(element) {
    try {
        element.style.display = "none";
    } catch (error) {
        // this element does not exist yere
    }
}

function showDOMelement(element) {
    try {
        element.style.display = "block";
    } catch (error) {
        // this element does not exist yere
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
    // add to list of years to filter by 
    yearsList.push(`${results.releaseDate.slice(0,4)}`);
    // album cover
    $(`#card${cardNumber} img`).attr(
        'src', results.artwork.url.replace('{w}', 350).replace('{h}', 350));
    // add album-details-link to album cover
    $(`#card${cardNumber} .album_details_link`).attr(
        'href', `/albumdetails/${albumNumber}`);
};

// ----- START FIREBASE FAVORITES SECTION ------
var myFavoriteAlbums;

function updateFavoriteAlbums() {
    dbRefrence = firebase.database().ref().child(userID + "/My Favorites");
    dbRefrence.on('value', snap => {
        myFavoriteAlbums = snap.val() || [];
        startFavoritesPage();
    });
}
// ----- END FIREBASE FAVORITES SECTION ------



// ----------- START FILTERING FUNCTIONALITY --------------
function removeDuplicates(inputArray){
    let outputArray = []
    for(let i = 0;i < inputArray.length; i++){
        if(outputArray.indexOf(inputArray[i]) == -1){
            outputArray.push(inputArray[i])
        }
    }
    return outputArray
}

var albumCardsList;
var yearsList = [];

// this populates the years the user can filter by in the dropdown
function buildYearFilters() {
    yearsList = removeDuplicates(yearsList);
    yearsList.sort();

    // clear everythig in list
    $('#year_filter_menu').html("");
    // add each year to list
    for (let index = 0; index < yearsList.length; index++) {
        let year = yearsList[index];
        $('#year_filter_menu').append(`<a class="badge badge-light year_to_filter_by" href="#" onclick="filterByYear(${year})">${year}</a>`)
    }  
};

function filterByYear(year) {
    // calling clear filters here allows user to change from one year to another
    clearFilters()

    for (let index = 0; index < albumCardsList.length; index++) {
        let thisCard = albumCardsList[index];
        if(!$(thisCard).hasClass(`year-${year}`)) {
            thisCard.style.display = "none";
        }
    }
};

function clearFilters() {
    for (let index = 0; index < albumCardsList.length; index++) {
        albumCardsList[index].style.display = "inline";
    }
}

// closes year filter dropdown menu when page is scrolling
$(document).on( 'scroll', function(){
    $('#year_filter_menu').removeClass('show');
});
// ----------- END FILTERING FUNCTIONALITY --------------


function startFavoritesPage() {
    // clear any warnings
    $('#all_cards').html("");
    // display instructions if no favorites exist for this user
    if (myFavoriteAlbums.length == 0) {
        $('#log_in_message').html("<div style='text-align:center;margin: 20px 0px 50px 0px;'><p>Looks like you don't have any favorites yet!</p><p><a href='/search'>Search</a> for albums and use the <img src='../images/heart-unliked.png' height='30' width='auto'> icon to add them to your favorites.</p></div>");
        hideDOMelement(document.getElementById("filter_by_year_dropdown_button"));
        hideDOMelement(document.getElementById("clear_filters_button"));
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
};

// an unordered list of albums, for smaller screens or longer lists.
// this works, I'm just not using it right now
// function populateList(albumNumber, results) {
//     $('.album_list').append(`<li><a href="/albumdetails/${albumNumber}"><img src="${results.artwork.url.replace('{w}', 30).replace('{h}', 30)}">&nbsp; ${results.name}</a> <span class="text-secondary font-italic">- ${results.artistName}</span></li>`);
// };
