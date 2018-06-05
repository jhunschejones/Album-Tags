console.log('The custom script for the favorites page is running.');

function getAlbumInfo(albumNumber, cardNumber) {
    
    $.getJSON( '/favorites/album/' + albumNumber)
    .done(function(rawData) {
    
    // if the album is from this year, populate the page, otherwise remove the card
    if(rawData.data[0].attributes.releaseDate.slice(0,4) == `${(new Date()).getFullYear()}`){
        populateCard(albumNumber, rawData.data[0].attributes, cardNumber);
    }
    else {
        let emptyCard = document.getElementById(`card${cardNumber}`)
        emptyCard.style.display = "none"
    }

    })
    .fail(function() { 
        // this function should only fail if there is trouble accessing the apple API
        // check jwt to see if it is still valid
        console.log("error accessing Apple API");
    });
};

// creates the album card with loading message and no details
function createCard(cardNumber) {
    $('#all_cards').append(`<div id="card${cardNumber}" class="card albumCard"><a class="album_details_link" href=""><img class="card-img-top" src="" alt=""><a/><div class="card-body"><h4 class="card-title"></h4><span class="album"><span class="text-primary">Loading Album Details...</span></span></div></div>`);
}

// populates the album card
function populateCard(albumNumber, results, cardNumber) {
    // artist name
    $(`#card${cardNumber} .card-body h4`).html(
        results.artistName);
    // album name
    $(`#card${cardNumber} .card-body .album`).html(
        ' ' + results.name); 
    // album cover
    $(`#card${cardNumber} img`).attr(
        'src', results.artwork.url.replace('{w}', 350).replace('{h}', 350));
    // add album-details-link to album cover
    $(`#card${cardNumber} .album_details_link`).attr(
        'href', `/albumdetails/${albumNumber}`);
};

// ----- START FIREBASE FAVORITES SECTION ------
var favoriteAlbums;
// Ol5d5mjWi9eQ7HoANLhM4OFBnso2
//
// [1343868318, 1334753255, 1314637017, 1324396794, 1296409535, 1348607884, 1344892854, 1318043781, 1303824307, 1316167917, 1351982641, 1369092265, 1362852732, 1356521195, 1338961464, 1361795429, 1375011130, 1346307591, 1347448476, 1328766663, 716394623]

dbRefrence = firebase.database().ref().child('Ol5d5mjWi9eQ7HoANLhM4OFBnso2/My Favorites');
dbRefrence.on('value', snap => {
    favoriteAlbums = snap.val();
    // now that favorites are obtained, sort and load the page
    favoriteAlbums.sort();
    startFavoritesPage();
});
// ----- END FIREBASE FAVORITES SECTION ------


function startFavoritesPage() {
    // clear any warnings
    $('#all_cards').html("");
    // create card and populate for each favorite album
    for (let index = 0; index < favoriteAlbums.length; index++) {
        let album = favoriteAlbums[index];
        let card = (index + 1);
        
        createCard(card);
        getAlbumInfo(album, card);
    }
};
