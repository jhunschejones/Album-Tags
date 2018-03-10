console.log("The custom script for the index page is running")

$(document).ready(function() {
    populateCard(1, 1338961464);
    populateCard(2, 1074379425);
    populateCard(3, 1334753255);
    populateCard(4, 1296409535);
    populateCard(5, 1241196179);
});

function populateCard(cardNumber, albumNumber){
    var cardContent = ''
    // this is populating the URL
    // current search logic does not need this
    // $.ajax({
    //     type: 'GET',
    //     url: '/thisweek/album/' + albumNumber})
    // this is pulling data from url and populating cards
    $.getJSON ( '/thisweek/album/' + albumNumber, function(rawData) {
        var artist = rawData.data[0].attributes.artistName;
        var album = rawData.data[0].attributes.name;
        var label = rawData.data[0].attributes.recordLabel;
        var release = rawData.data[0].attributes.copyright.slice(0, 6);
        var cover = rawData.data[0].attributes.artwork.url.replace('{w}', 500).replace('{h}', 500)
        
        $('#card' + cardNumber + ' .card-body h4').html(artist);
        $('#card' + cardNumber + ' .card-body .album').html(' ' + album);
        $('#card' + cardNumber + ' .card-body .label').html(' ' + label);
        $('#card' + cardNumber + ' .card-body .release').html(' ' + release);
        $('#card' + cardNumber + ' img').attr("src", cover);
    })
}
