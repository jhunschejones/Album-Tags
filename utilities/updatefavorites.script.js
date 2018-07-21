
// ======= RUN THIS FUNCTION WHILE LOGGED IN TO UPDATE DATABASE =======
// console.log('Run startFavoritesUpdate() to update the datastructure of your favorites!')
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
