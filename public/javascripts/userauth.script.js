console.log('userauth script is running');

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
var updateTagsPage = document.getElementById("all_the_things");
var logInMessage = document.getElementById("log_in_message");
var userEmail = "";
var user = firebase.auth().currentUser;

// checking if user is logged in or logs in during session
firebase.auth().onAuthStateChanged(function(user) {
    // returns true if user is not null
    if (user) {
        loginButton.style.display = "none";
        userEmail = user.email;
        if (allowedUsers.indexOf(userEmail) > -1) {
            // user is signed in and has permissions
            tagUpdatePermissionsGranted();
        } 
        else {
            // user is signed in but does not have permissions
            noTagUpdatePermissions();
            console.log('This user is not authorized to update tags.');
        }
    } else {
        // No user is signed in.    
        noTagUpdatePermissions();
    }
});

function noTagUpdatePermissions() {
    try {
        updateTagsPage.style.display = "none";
        loginButton.style.display = "block";
        logInMessage.innerHTML = '<div class="container-fluid"><p class="text-danger">Please sign in to update</p> <button onclick="logIn()" class="btn btn-danger" id="login_link">Log In</button></div>';
    } catch (error) {
        console.log(error);
    }  
}

function tagUpdatePermissionsGranted() {
    try {
        $("#update_button_container").html('<a href="" onclick="goToUpdatePage()" class="btn btn-sm btn-outline-secondary update_button">Update Tags</a>');
        updateTagsPage.style.display = "block";
        logInMessage.innerHTML = "";
    } catch (error) {
        console.log(error)
    }
}

// add event listener to log in button 
loginButton.addEventListener("click", logIn);

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
