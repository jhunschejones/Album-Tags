console.log('The custom script for the "this week" page is running');

function getAlbumInfo(albumNumber, cardNumber) {
    // console.log('getAlbumInfo called for card ', cardNumber);
    
    $.getJSON( '/thisweek/album/' + albumNumber)

    .done(function(rawData) {
    // console.log('json returned for card ', cardNumber);
    // send album info to populateCard
    populateCard(albumNumber, rawData.data[0].attributes, cardNumber);

    // Ben's Suggestions:
    // try fetch
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    // note: make sure to handle successful case and rejected case
    })
    .fail(function() { 
        console.log("error");
    });
};


function populateCard(albumNumber, results, cardNumber) {
    
    // artist name
    $(`#card${cardNumber} .card-body h4`).html(
        results.artistName);
    // album name
    $(`#card${cardNumber} .card-body .album`).html(
        ' ' + results.name); 
    // record label       
    $(`#card${cardNumber} .card-body .label`).html(
        ' ' + results.recordLabel);
    // copywrite symbol, release year
    $(`#card${cardNumber} .card-body .release`).html(
        ' ' + results.copyright.slice(0, 6));
    // album cover
    $(`#card${cardNumber} img`).attr(
        'src', results.artwork.url.replace('{w}', 350).replace('{h}', 350));
    $(`#card${cardNumber} .card-body .album_details_link`).attr(
        'href', `/albumdetails/${albumNumber}`);
};

getAlbumInfo(1343868318, 1);
getAlbumInfo(1156235635, 2);
getAlbumInfo(1156277169, 3);
getAlbumInfo(1303824307, 4);
getAlbumInfo(1265155622, 5);
