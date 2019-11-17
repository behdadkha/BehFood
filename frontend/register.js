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


    $("#password_field1").click((e) => {
        document.getElementById("password_field1").select();
    });
    $("#password_field2").click((e) => {
        document.getElementById("password_field2").select();
    });
    $("#email_field").click((e) => {
        document.getElementById("email_field").select();
    });


    var email;
    var username;
    $("#submit_btn").click((e) => {
        e.preventDefault();
        email = $("#email_field").val();
        username = $("#username_field").val();
        const pass1 = $("#password_field1").val();
        const pass2 = $("#password_field2").val();
        
        
        if(pass1 != pass2){
            $("#password_label").append("<h6>passwords dont match</h6>");
        }else{
            //see if the user exists or not
            fetch(`/check_user/${email}`, {method: 'get'}).then((res) => {
                return res.json();
            }).then((data) => {
                if(data == false){// user doesnt exist
                    firebase.auth().createUserWithEmailAndPassword(email, pass1).catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log("error " + errorMessage);
                        // ...
                        }).then(() => {
                        if(country != null){
                            /*
                            fetch('/writeUser', {
                                method: 'post',
                                body: JSON.stringify(
                                    {
                                        email : email,
                                        country: country,
                                        city: city,
                                        username: username

                                    }),
                                headers :{
                                    "Content-Type" : "application/json; charset=utf-8"
                                }
                            }).then((res)=>{
                                return res.json();
                            });*/
                            
                        }
                    }); 
                }else{
                    //user (email) already exists
                    $("#email_label").text("Email exists");
                }  
            });

        }
    });
    var country;
    var city;
    const findLocation = () => {
        $.ajax('http://ip-api.com/json')
        .then(
            function success(response) {
                
                country = response.country;
                city = response.city;
            },
      
            function fail(data, status) {
                console.log('Request failed.  Returned status of',
                            status);
            }
        );
    }
    findLocation();
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          $("#signin_form").css("display", "none");
          $("#after_signin").css("visibility", "visible");
          $("#signin_now").css("display", "none");
          firebase.database().ref('Users/' + user.uid).once('value').then((snap) => {
            
            if(snap.val() == null){
                firebase.database().ref('Users/' + user.uid).set({
                    email: email,
                    country: country,
                    city: city,
                    username: username
                });
            }
          });
          
          // ...
        } else {
          // User is signed out.
          
        }
    });
    $("#continue_btn").click(() => {
        window.location.href = "/";
    });
});