// --------- START UTILITIES --------
console.log('The custom script for album connections is running');

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
// --------- END UTILITIES --------

// ----- START FIREBASE ALBUM CONNECTIONS SECTION ------
var connectedAlbums = [];
var directConnections = [];

function updateConnectedAlbums() {
    var dbRefrence3 = database2.ref().child(albumId);
    dbRefrence3.on('value', snap => {
        connectedAlbums = snap.val() || [];

        findDirectConnections();
    });
}
// ----- END FIREBASE ALBUM CONNECTIONS SECTION ------


// drills through full connectedAlbums array to pull out direct connections
function findDirectConnections() {
    directConnections = [];
    
    if (connectedAlbums.length != 0) {
        for (let index = 0; index < connectedAlbums.length; index++) {
            var connectionObject = connectedAlbums[index];
            
            // avoids js errors for undefined values
            // only adds connections created by this author
            if (connectionObject != undefined & connectionObject.author == userID) {
                
                directConnections.push(connectionObject.connection)
            }
        }
    }
    populateConnections();
}

// drills through directConnections to pull out connected albums and show them on the page
function populateConnections() {
    $(".connection_results").text('');

    if (directConnections.length != 0) {
        showDOMelement("connections_card");

        for (let index = 0; index < directConnections.length; index++) {
            let connection = directConnections[index];

            if (connection != albumId) {
                $.getJSON ( '/albumdetails/json/' + parseInt(connection), function(rawData) {
                    var cover = rawData.data[0].attributes.artwork.url.replace('{w}', 105).replace('{h}', 105);
                    $('.connection_results').append(`<a href="/albumdetails/${connection}"><img class="small_cover" src="${cover}"></a>`)
                });
            }
        }
    }
}
