console.log("custom script is running")
$(document).ready(function() {
    populateCard(1);
    populateCard(2);
    populateCard(3);
    populateCard(4);
    populateCard(5);
});

function populateCard(cardNumber){
    var cardContent = ''
    $.getJSON ( '/users/album' + cardNumber, function(rawData) {
        var artist = rawData.data[0].attributes.artistName;
        var album = rawData.data[0].attributes.name;
        var label = rawData.data[0].attributes.recordLabel;
        var release = rawData.data[0].attributes.copyright.slice(0, 6);
        var cover = rawData.data[0].attributes.artwork.url.replace('{w}', 500).replace('{h}', 500)
        $('#card' + cardNumber + ' .card-block h4').html(artist);
        $('#card' + cardNumber + ' .card-block .card-text .album').html(' ' + album);
        $('#card' + cardNumber + ' .card-block .card-text .label').html(' ' + label);
        $('#card' + cardNumber + ' .card-block .card-text .release').html(' ' + release);
        $('#card' + cardNumber + ' img').attr("src", cover);
    })
}