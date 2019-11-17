$(document).ready(() => {
    var firebaseConfig = {
        apiKey: "API key goes here",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""
    };
    firebase.initializeApp(firebaseConfig);

    //state change
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        addPost();

        $("#user-manage").css("visibility", "visible");
                $("#register_btn").remove();
                $("#or_text").remove();
                $("#signin_btn").remove();
                $("#user-email").text(user.email);
      
                $("#user-signout").click(() => {
                  firebase.auth().signOut().then(function() {
                      window.location.href = "/";
                    }).catch(function(error) {
                      console.log(error);
                    });
                });
                  //user's profile button
                  $("#user-profile").click(() => {
                      window.location.href = `/profile?email=${user.email}`;
                  });
        
    } else {
        $("#user-manage").css("visibility", "visible");
        $(".dropdown").css("visibility", "hidden");
        console.log("not loged in");
      }
  });
  document.getElementById("logo").onclick = ()=>{
    window.location.href = "/";
  };
    //post button
    const addPost = () => {
        $("#post").click( (e) =>{
            e.preventDefault();
            console.log("working");
            const date = Date(Date.now()).toString();
            var user = firebase.auth().currentUser;
        
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const country = document.getElementById('country').value;
            const city = document.getElementById('city').value;
            const state = document.getElementById('state').value;//not used
            const price = document.getElementById('price').value;
        
            if(title.length == 0){
              document.getElementById('title_alert').style.display = "inline";
              return;
            }else if(description.length == 0){
              document.getElementById('description_alert').style.display = "inline";
              return;
            }
            else if(country.length == 0){
              document.getElementById('country_alert').style.display = "inline";
              return;
            }
            else if(price.length == 0){
              document.getElementById('price_alert').style.display = "inline";
              return;
            }
        
            var file = document.getElementById('image').files[0];
            if(file == null){
              document.getElementById('alert').style.display = "inline";
              return;
            }
            document.getElementById('loading').style.display = "block";
            document.getElementById('post').style.display = "none";
            document.getElementById('alert').style.display = "none";
            const path = 'images/' + user.email + " " + date;
            var storageRef = firebase.storage().ref(path);
            storageRef.put(file).then(function(){
              storageRef.getDownloadURL().then(function(url){
                firebase.database().ref('Users/' + user.uid + "/Post" + "/" + title).set({
                  city: city,
                  country: country,
                  state: state,
                  email: user.email,
                  imageurl: url,
                  price: price,
                  refrence: title + " Date: " + date,
                  text: description,
                  title: title
                /*firebase.database().ref('Posts/' + title + " Date: " + date).set({
                  city: city,
                  country: country,
                  state: state,
                  email: user.email,
                  imageurl: url,
                  price: price,
                  refrence: title + " Date: " + date,
                  text: description,
                  title: title*/
                
                }).then(function(){
                  fetch('/writeinPosts', {
                    method: 'post',
                    body: JSON.stringify(
                        {
                          city: city,
                          country: country,
                          state: state,
                          email: user.email,
                          imageurl: url,
                          price: price,
                          refrence: title + " Date: " + date,
                          text: description,
                          title: title
                        }),
                    headers :{
                        "Content-Type" : "application/json; charset=utf-8"
                    }
                    }).then((res)=>{
                        return res.json();
                    });
                  document.getElementById('item_added').style.display = "block";
                  document.getElementById('loading').style.display = "none";
                  document.getElementById('post').style.display = "block";
                  document.getElementById('add_post_form').reset();
                });

                
              });
            });

            
            
          });

    }
  
});