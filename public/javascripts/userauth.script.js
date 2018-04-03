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

var allowedUsers = ["joshjones103@gmail.com", "znoffy5@gmail.com", "devon.curry891@gmail.com", "milesjohnsonmusic@gmail.com", "austinhuelsbeck@gmail.com"];
var loginButton = document.getElementById("login_button");
var userEmail = "";
var user = firebase.auth().currentUser;

// hides login button when user is logged in
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        loginButton.style.display = "none";
        userEmail = user.email;
        if (allowedUsers.indexOf(userEmail) > -1){
            $("#update_button_container").html('<a href="" onclick="goToUpdatePage()" class="btn btn-sm btn-outline-secondary update_button">Update Tags</a>');
        } 
        else {
            console.log('This user is not authorized')
        }
    } else {
        // No user is signed in.
        loginButton.style.display = "block";
    }
});

// logs user in using google auth
loginButton.addEventListener("click", function() {

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function() {
      var provider = new firebase.auth.GoogleAuthProvider();
      // In memory persistence will be applied to the signed in Google user
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
    });
})

function goToUpdatePage() {
    event.preventDefault();
    let url = window.location.href;
    url = url.replace("albumdetails", "update");
    window.location = url;
};
