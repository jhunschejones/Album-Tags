// --------- START UTILITIES --------
console.log('The custom script for the userauth page is running');

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

// Initialize Firebase
var config = {
    apiKey: "AIzaSyD1Hts7zVBvDXUf-sCb89hcPesJkrUKyUc",
    authDomain: "album-tag-auth.firebaseapp.com",
    databaseURL: "https://album-tag-favorites.firebaseio.com/",
    projectId: "album-tag-auth",
    storageBucket: "album-tag-auth.appspot.com",
    messagingSenderId: "1048555394172"
};
const app1 = firebase.initializeApp(config);

const app2 = firebase.initializeApp({
    apiKey: "AIzaSyD1Hts7zVBvDXUf-sCb89hcPesJkrUKyUc",
    databaseURL: "https://album-tag-connections.firebaseio.com/",
    projectId: "album-tag-auth"
}, 'app2');

const app3 = firebase.initializeApp({
    apiKey: "AIzaSyD1Hts7zVBvDXUf-sCb89hcPesJkrUKyUc",
    databaseURL: "https://album-tag-auth.firebaseio.com/",
    projectId: "album-tag-auth"
}, 'app3');

// Get a database instance for app2 and app3
var database1 = firebase.database(app2);
var database2 = firebase.database(app3);

const allowedUsers = ["joshjones103@gmail.com", "znoffy5@gmail.com", "devon.curry891@gmail.com", "milesjohnsonmusic@gmail.com", "austinhuelsbeck@gmail.com"];
var loginButton = document.getElementById("login_button");
var loginButton2 = document.getElementById("full_menu_login_button")
var logoutButton = document.getElementById("logout_button");
var logoutButton2 = document.getElementById("full_menu_logout_button")
var logInMessage = document.getElementById("log_in_message");
var loader = document.getElementById("loader");
var userEmail = "";
var userName = "";
var user = firebase.auth().currentUser;
var userID;
var dbRefrence;


// checking if user is logged in or logs in during session
firebase.auth().onAuthStateChanged(function(user) {
    // returns true if user is not null
    if (user) {

        // new hide functionality
        $('.hide_when_logged_in').addClass('hide_me');
        $('.hide_when_logged_out').removeClass('hide_me');

        showDOMelement("full_menu_login_logout_container");

        // set our variables with this user's info
        userEmail = user.email;
        userName = user.displayName;
        userID = user.uid;

        // update favorite albums if page uses this functionality
        try {
            updateFavoriteAlbums();
        } catch (error) {
            // we're not on the my favorites page
        }

        try {
            updateConnectedAlbums()
        } catch (error) {
            // we're not on a connected albums page
        }

        try {
            populateUserData();
        } catch (error) {
            // we're not on contact page
        }


        if (allowedUsers.indexOf(userEmail) > -1) {
            // user is signed in and has permissions
            tagUpdatePermissionsGranted();

            var whatTagsToShow = sessionStorage.getItem('tags');
            if (whatTagsToShow != 'All Tags') {
                sessionStorage.setItem('tags', 'My Tags');
                filterDisplayedTags();
            } else {
                allTagsNoFilter()
            }
            // can add admin functions here 
        } 
        else {
            // user is signed in but does not have tag permissions
            // console.log('This user is not authorized to update tags.');
            // connectionPermissionsGranted();
            // filterDisplayedTags();
            // user is signed in and has permissions
            tagUpdatePermissionsGranted();
            
            var whatTagsToShow = sessionStorage.getItem('tags');
            if (whatTagsToShow != 'All Tags') {
                sessionStorage.setItem('tags', 'My Tags');
                filterDisplayedTags();
            }
        }
    } else {
        // No user is signed in.    
        noUserSignedIn();
    }
});

function noUserSignedIn() {
    try {
        logInMessage.innerHTML = '<div class="container-fluid please_log_in"><p class="text-danger">Please sign in to access this feature</p> <button onclick="logIn()" class="btn btn-danger" id="login_link">Log In</button></div>';
    } catch (error) {
        // no login message container on this page
    }  
    // hide spinner
    hideDOMelement("loader");

    // new hide functionality
    $('.hide_when_logged_in').removeClass('hide_me');
    $('.hide_when_logged_out').addClass('hide_me');

    showDOMelement("full_menu_login_logout_container");
}

function tagUpdatePermissionsGranted() {
    var whatTagsToShow = sessionStorage.getItem('tags');

    if (whatTagsToShow != 'My Tags' & whatTagsToShow != 'All Tags') {
        sessionStorage.setItem('tags', 'My Tags');
    }

    $("#update_button_container").html('<a href="" onclick="goToUpdatePage()" class="btn btn-sm btn-primary update_button hide_when_logged_out">Update Tags</a>');

    $("#tags_toggle").html('<img src="/images/toggle_off.png" id="show_only_my_tags" class="hide_when_logged_out" style="height:24px;margin-top:17px;margin-left:5px;" onclick="showAllTags()"data-toggle="tooltip" data-placement="right" title="Show All Tags"><img src="/images/toggle_on.png" class="hide_when_logged_out" id="show_all_tags" style="height:24px;margin-top:17px;margin-left:5px;" onclick="showOnlyMyTags()" data-toggle="tooltip" data-placement="right" title="Only Show My Tags">');

    $("#connection_button_container").html('<a href="" onclick="goToUpdatePage()" class="btn btn-sm btn-outline-secondary update_button hide_when_logged_out">Update Connections</a>');

    try {
        logInMessage.innerHTML = "";
    } catch (error) {
        // console.log(error)
    }
    try {
        checkUserDisplayPrefrences(); 
    } catch (error) {
        // console.log(error)        
    }
}

// This is old functionality from when connections permissions was a lower set of permissions from tag permissions
//
// function connectionPermissionsGranted() {
//     try {
//         $("#connection_button_container").html('<a href="" onclick="goToUpdatePage()" class="btn btn-sm btn-outline-secondary update_button">Update Connections</a>');
//         // Rmoving stuff the user should't have access to here
//         $('#tags_table').remove();
//         $('#new_tag').remove();
//         $('#add_tag_button').remove();
//         $('.warning_label').remove();
//         $('.add_tag_text_input').remove();
//         logInMessage.innerHTML = "";
//     } catch (error) {
//         // console.log(error)
//     }
// }

function filterDisplayedTags() {
    try {
        let anyTagsOnPage = false
        tagsForThisAlbum = $(".album_details_tags")
        for (let index = 0; index < tagsForThisAlbum.length; index++) {
            let thisTag = tagsForThisAlbum[index];
    
            if($(thisTag).hasClass(`author-${userID}`)) {
                // console.log("tag belongs to this author")
                $(thisTag).show()
                anyTagsOnPage = true
            } else {
                // console.log("tag does not belong to this author")
                $(thisTag).hide()
            }
        }  
        if (anyTagsOnPage == true) {
            $(".tag_search_button").show() 
        } else {
            $(".tag_search_button").hide()
            $('#tag_results').html('<small class="text-primary">You currently have no tags for this album!</small>'); 
        }
    } catch (error) {
        // not on album details
    }
}

function allTagsNoFilter() {
    try {
        let anyTagsOnPage = false
        tagsForThisAlbum = $(".album_details_tags")
        
        if (tagsForThisAlbum.length > 0) { 
            anyTagsOnPage = true 
            for (let index = 0; index < tagsForThisAlbum.length; index++) {
                let thisTag = tagsForThisAlbum[index];
                $(thisTag).show()
            }  
        }

        if (anyTagsOnPage == true) {
            $(".tag_search_button").show() 
        } else {
            $(".tag_search_button").hide()
            $('#tag_results').html('<small class="text-primary">There are currently no tags for this album!</small>'); 
        }
    } catch (error) {
        // not on album details
    }

}

// log user in using google auth
function logIn() {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    // local persistance remains if browser is closed
    .then(function() {
      var provider = new firebase.auth.GoogleAuthProvider();
      return firebase.auth().signInWithPopup(provider);
    })
    .then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        userEmail = result.user.email;

    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    })
};

// directs user to update page for this album
function goToUpdatePage() {
    event.preventDefault();
    let url = window.location.href;
    url = url.replace("albumdetails", "update");
    window.location = url;
};

function logOut() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.        
        noUserSignedIn();
    }).catch(function(error) {
    // An error happened.
    });
};

// add event listener to log in and out buttons
loginButton.addEventListener("click", logIn);
loginButton2.addEventListener("click", logIn);
logoutButton.addEventListener("click", logOut);
logoutButton2.addEventListener("click", logOut);