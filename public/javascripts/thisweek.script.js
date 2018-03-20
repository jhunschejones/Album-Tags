console.log('The custom script for the "this week" page is running')

$(document).ready(function() {
    populateCard(1, 1293987105);
    populateCard(2, 1342391131);
    populateCard(3, 1241403727);
    populateCard(4, 1261052928);
    populateCard(5, 271951016);
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
        $('#card' + cardNumber + ' .card-body .album_details_link').attr('href', '/albumdetails/' + albumNumber);
        $('#card' + cardNumber + ' .card-body .label').html(' ' + label);
        $('#card' + cardNumber + ' .card-body .release').html(' ' + release);
        $('#card' + cardNumber + ' img').attr("src", cover);
    })
}
