console.log('The custom script for the userauth page is running');

// Initialize Firebase
var config = {
    apiKey: "AIzaSyD1Hts7zVBvDXUf-sCb89hcPesJkrUKyUc",
    authDomain: "album-tag-auth.firebaseapp.com",
    databaseURL: "https://album-tag-auth.firebaseio.com",
    projectId: "album-tag-auth",
    storageBucket: "album-tag-auth.appspot.com",
    messagingSenderId: "1048555394172"
};
firebase.initializeApp(config);

const allowedUsers = ["joshjones103@gmail.com", "znoffy5@gmail.com", "devon.curry891@gmail.com", "milesjohnsonmusic@gmail.com", "austinhuelsbeck@gmail.com"];
var loginButton = document.getElementById("login_button");
var logoutButton = document.getElementById("logout_button");
var loginDivider = document.getElementById("login_divider");
var updateTagsPage = document.getElementById("all_the_things");
var clearFiltersButton = document.getElementById("clear_filters_button");
var filter_by_year_dropdown_button = document.getElementById("filter_by_year_dropdown_button");
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

        // remove login button
        loginButton.style.display = "none";
        logoutButton.style.display = "block";
        // loginDivider.style.display = "none";

        // set our variables with this user's info
        userEmail = user.email;
        userName = user.displayName;
        userID = user.uid;

        // update favorite albums if page uses this functionality
        try {
            updateFavoriteAlbums();
        }
        catch (error) {
            // we're not on the my favorites page
        }


        if (allowedUsers.indexOf(userEmail) > -1) {
            // user is signed in and has permissions
            tagUpdatePermissionsGranted();
        } 
        else {
            // user is signed in but does not have permissions
            console.log('This user is not authorized to update tags.');
        }
    } else {
        // No user is signed in.    
        noUserSignedIn();
    }
});

function noUserSignedIn() {
    try {
        logInMessage.innerHTML = '<div class="container-fluid please_log_in"><p class="text-danger">Sign in to access this feature</p> <button onclick="logIn()" class="btn btn-danger" id="login_link">Log In</button></div>';
    } catch (error) {
        // no login message container on this page
    }  
    showDOMelement(loginButton);
    showDOMelement(loginDivider);
    hideDOMelement(clearFiltersButton);
    hideDOMelement(filter_by_year_dropdown_button);
    hideDOMelement(updateTagsPage);   
    // hide spinner
    hideDOMelement(loader);
}

function hideDOMelement(element) {
    try {
        element.style.display = "none";
    } catch (error) {
        // this element does not exist yere
    }
}

function showDOMelement(element) {
    try {
        element.style.display = "block";
    } catch (error) {
        // this element does not exist yere
    }
}

function tagUpdatePermissionsGranted() {
    try {
        $("#update_button_container").html('<a href="" onclick="goToUpdatePage()" class="btn btn-sm btn-primary update_button">Update Tags</a>');
        updateTagsPage.style.display = "block";
        logInMessage.innerHTML = "";
    } catch (error) {
        // console.log(error)
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
        logoutButton.style.display = "none";
        remove_from_favorites.style.display = "none";
        add_to_favorites.style.display = "none";
    // Sign-out successful.
    }).catch(function(error) {
    // An error happened.
    });

}

// add event listener to log in and out buttons
loginButton.addEventListener("click", logIn);
logoutButton.addEventListener("click", logOut);