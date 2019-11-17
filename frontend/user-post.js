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

    const showPosts = (email,uid) => {
        const display = $("#display");
        firebase.database().ref('Users/' + uid + "/Post").once('value').then((snap) => {
            if(snap.val() != null)//
                displayPosts(snap.val(), display);
            else{
                console.log("No post to show");
            }
        });
        
        const displayPosts = (data, ulName) => {
            for(var key in data){
                ulName.append(postTemplate(data[key],data[key].refrence));
                showPostClickListner(data[key],data[key].refrence);
            } 
            
        }
        const postTemplate = (post,key) => {
            let text = post.text;
            if(post.text.length > 150){
                text = post.text.substring(0,151) + "...";
            }
            return `<li class="list-group-item" id="${key}">
                        <div class="row">
                            
                            <div class="col-4">
                                <img id="image" src="${post.imageurl}" class="rounded float-left" alt="...">   
                            </div>
                            <div class="col-8">
                                <div id="title">${post.title}</div>
                                <div class="row" id="text-row">
                                    <div class="col-12">${text}</div> 
                                </div>
                                
                               
                            </div>
                            
                            <div class="col-8"></div>
                            <div class="col-4" id="address">
                                <div style="float:right; padding-right:10%">
                                    ${post.city},${post.country}
                                </div>
                            </div>
                            
                        </div>
                    </li>`;
    
        }
        const showPostClickListner = (post, id) => {
            const clickable = document.getElementById(id);
            clickable.onclick = () => {
                console.log(id);
                window.location.href = `/posts?id=${id}`;
            } 
        }
    }
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
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
            
            // show users posts
            showPosts(user.email, user.uid);
        } else {
          // User is signed out.
          $("#user-manage").css("visibility", "visible");
          $(".dropdown").css("visibility", "hidden");
          $("#not-signed").css("display", "block");
          console.log("not loged in");
        }
    });
    document.getElementById("logo").onclick = ()=>{
        window.location.href = "/";
    };
    document.getElementById("signin_btn").onclick = ()=>{
            window.location.href = "/signin";
    };
    document.getElementById("register_btn").onclick = ()=>{
        window.location.href = "/register";
    };

    $("#post_btn").click(() => {
        window.location.href = "/post";
    });
});