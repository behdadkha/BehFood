$(document).ready(() => {
    var firebaseConfig = {
        apiKey: "AIzaSyAne_XwzSuKUCZnOfhxXY3_zV8BxbDeZ4E",
        authDomain: "behfood-af5a2.firebaseapp.com",
        databaseURL: "https://behfood-af5a2.firebaseio.com",
        projectId: "behfood-af5a2",
        storageBucket: "behfood-af5a2.appspot.com",
        messagingSenderId: "36862253752",
        appId: "1:36862253752:web:db58ed4e83cd84e9"
      };
      firebase.initializeApp(firebaseConfig);

    $("#submit_btn").click((e) => {
        e.preventDefault();

        const email = $("#email_field").val();
        const password = $("#password_field").val();
        
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if(errorMessage.includes("The password is invalid")){
              $("#incorect_pass").text("Incorrect Password");
            }
        });
        
    });
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          window.location.href = "/";
          // ...
        } else {
          // User is signed out.
          
        }
    });

    $("#reg_btn").click(()=>{
      window.location.href = "/register";
    });
    $("#password_field").click((e) => {
      document.getElementById("password_field").select();
    });
    $("#email_field").click((e) => {
        document.getElementById("email_field").select();
    });
      
});