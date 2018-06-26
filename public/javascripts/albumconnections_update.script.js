// --------- START UTILITIES --------
console.log('The custom script for album connections update page is running');

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

var isEqual = function (value, other) {
// source: https://gomakethings.com/check-if-two-arrays-or-objects-are-equal-with-javascript/
	// Get the value type
	var type = Object.prototype.toString.call(value);

	// If the two objects are not the same type, return false
	if (type !== Object.prototype.toString.call(other)) return false;

	// If items are not an object or array, return false
	if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

	// Compare the length of the length of the two items
	var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
	var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
	if (valueLen !== otherLen) return false;

	// Compare two items
	var compare = function (item1, item2) {

		// Get the object type
		var itemType = Object.prototype.toString.call(item1);

		// If an object or array, compare recursively
		if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
			if (!isEqual(item1, item2)) return false;
		}

		// Otherwise, do a simple comparison
		else {

			// If the two items are not the same type, return false
			if (itemType !== Object.prototype.toString.call(item2)) return false;

			// Else if it's a function, convert to a string and compare
			// Otherwise, just compare
			if (itemType === '[object Function]') {
				if (item1.toString() !== item2.toString()) return false;
			} else {
				if (item1 !== item2) return false;
			}

		}
	};

	// Compare properties
	if (type === '[object Array]') {
		for (var i = 0; i < valueLen; i++) {
			if (compare(value[i], other[i]) === false) return false;
		}
	} else {
		for (var key in value) {
			if (value.hasOwnProperty(key)) {
				if (compare(value[key], other[key]) === false) return false;
			}
		}
	}

	// If nothing failed, return true
	return true;
};

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
            
            // avoids js errors for undefined values
            if (connection != undefined) {
                for (let index = 0; index < connection.length; index++) {
                    let element = connection[index];
                    if (element == albumId) { directConnections.push(connection) }   
                }
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
                        var cover = rawData.data[0].attributes.artwork.url.replace('{w}', 75).replace('{h}', 75);
                        $('.connection_results').append(`<tr><td><a href="/albumdetails/${element}"><img class="small_cover" src="${cover}"></a></td><td><a href="" onclick="deleteConnection(${element})">Delete</a></td></tr>`)
                    });
                }
            }  
        }
    }
}

var isDelete = false;

function newConnection() {
    if ($('#new_connection').val() != ''){
        let newAlbumId = parseInt($('#new_connection').val());
        isDelete = false;

        $.getJSON ( '/albumdetails/json/' + parseInt(newAlbumId), function(rawData) {
            // check if this is a valid album id
            // rawData.errors returns undefined if there are no errors
            // rawData.data returns undefined if there are no albums
            if (rawData.data) {
                isValidAlbum = true
            } else {
                isValidAlbum = false
            }
        }).then(function(){
            if (isValidAlbum) {
                createConnection(newAlbumId, isDelete);
            } else {
                alert("Sorry, Apple says that's not an album ID.")
            }
        })

        $('#new_connection').val('');
    } else {
        // console.log("Connection field is blank")
    }
}

function deleteConnection(connectedAlbum) {
    event.preventDefault()
    var confirmation = confirm('Are you sure you want to delete a connection?');
    if (confirmation === true) {
        isDelete = true;
        createConnection(connectedAlbum, isDelete);
    }
}

function createConnection(newAlbumId, isDelete) {
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
    if (isDelete == true) { removeConnection(newConnection) }

    if (duplicate == false && isDelete == false) { addConnection(newConnection) }
    else {console.log("Duplicate")}
}

function addConnection(newConnection) {
    connectedAlbums.push(newConnection);

    updateConnectionDatabase();
}

function removeConnection(connection) {
    var index

    for (let j = 0; j < connectedAlbums.length; j++) {
        let element = connectedAlbums[j];

        if (isEqual(element, connection) == true) { 
            index = connectedAlbums.indexOf(element) 
        }
    }

    connectedAlbums.splice(index, 1);
    updateConnectionDatabase();
}

function updateConnectionDatabase() {
    database1.ref().child(userID).set({
        "Connected Albums" : connectedAlbums
    });
}
