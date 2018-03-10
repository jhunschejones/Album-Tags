console.log("The custom script for the album details page is running")

var albumId = $(".heres_the_album_id").text();

function populateAlbumDetails(albumNumber){

    // this is populating the URL
    // current search logic does not need this
    // $.ajax({
    //     type: 'GET',
    //     url: '/albumdetails/json/' + albumNumber
    // })
    // this is pulling data from url and populating cards

    $.getJSON ( '/albumdetails/json/' + albumNumber, function(rawData) {
        var artist = rawData.data[0].attributes.artistName;
        var album = rawData.data[0].attributes.name;
        var label = rawData.data[0].attributes.recordLabel;
        var copyright = rawData.data[0].attributes.copyright.slice(0, 6);
        var cover = rawData.data[0].attributes.artwork.url.replace('{w}', 500).replace('{h}', 500)
        var applemusicurl = rawData.data[0].attributes.url;
        var release = makeNiceDate(rawData.data[0].attributes.releaseDate);
        
        $('.albumdetails_artist').append(artist);
        $('.albumdetails_album').append(album, '<br>');
        $('.albumdetails_details img').attr("src", cover, '<br');
        $('.card-body a').attr("href", applemusicurl, '<br>');
        $('.albumdetails_label').append(label, '<br>');
        $('.albumdetails_release').append(release, '<br>');
        // $('#card' + cardNumber + ' .card-body .label').html(' ' + label);
        // $('#card' + cardNumber + ' .card-body .release').html(' ' + release);

    })
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function makeNiceDate(uglyDate) {
    let year = uglyDate.slice(0, 4);
    let day = uglyDate.slice(8, 10);
    let uglyMonth = uglyDate.slice(5, 7); 
    let niceMonth = months[uglyMonth-1];
    return(`${niceMonth} ${day}, ${year}`)
}

populateAlbumDetails(parseInt(albumId));