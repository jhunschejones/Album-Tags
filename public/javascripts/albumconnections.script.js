// --------- START UTILITIES --------
console.log('The custom script for album connections is running');

function hideDOMelement(elementId) {
    try {
        let element = document.getElementById(elementId)
        element.style.display = "none";
    } catch (error) {
        // this element does not exist yere
    }
}

function showDOMelement(elementId) {
    try {
        let element = document.getElementById(elementId)
        element.style.display = "block";
    } catch (error) {
        // this element does not exist yere
    }
}
// --------- END UTILITIES --------

// ----- START FIREBASE ALBUM CONNECTIONS SECTION ------
var connectedAlbums = [];
var directConnections = [];

function updateConnectedAlbums() {
    var dbRefrence2 = database1.ref().child(userID + "/Connected Albums");
    dbRefrence2.on('value', snap => {
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
            let connection = connectedAlbums[index];

            for (let index = 0; index < connection.length; index++) {
                let element = connection[index];
                if (element == albumId) { directConnections.push(connection) }   
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

            for (let index = 0; index < connection.length; index++) {
                let element = connection[index];
                if (element != albumId) {
                    $.getJSON ( '/albumdetails/json/' + parseInt(element), function(rawData) {
                        var cover = rawData.data[0].attributes.artwork.url.replace('{w}', 105).replace('{h}', 105);
                        $('.connection_results').append(`<a href="/albumdetails/${element}"><img class="small_cover" src="${cover}"></a>`)
                    });
                }
            }  
        }
    }
}

function letsAddAConnection() {
    if ($('#new_connection').val() != ''){
        let newAlbumId = parseInt($('#new_connection').val());
        createConnection(newAlbumId);
    } else {
        console.log("Field is blank")
    }
}



function createConnection(newAlbumId) {
    let newConnection = [albumId, newAlbumId]
    let duplicate = false

    if (directConnections.length != 0) {
        for (let index = 0; index < directConnections.length; index++) {
           let connection = directConnections[index];

           for (let index = 0; index < connection.length; index++) {
               let element = connection[index];
               if (element == newAlbumId) { duplicate = true }   
           }
       }
   }

    if (duplicate == false) { addConnection(newConnection) }
    else {console.log("Duplicate")}
}

function addConnection(newConnection) {
    connectedAlbums.push(newConnection);

    updateConnectionDatabase();
}

function updateConnectionDatabase() {
    database1.ref().child(userID).set({
        "Connected Albums" : connectedAlbums
    });
}
