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
          // ...
        } else {
          // User is signed out.
          $("#user-manage").css("visibility", "visible");
          $(".dropdown").css("visibility", "hidden");
          console.log("not loged in");
        }
    });
    var posts;//stores the posts fetched from server
    const display = $("#display");
    const after_search = $("#after_search");
    const retrieve = () => {
        fetch('/getPosts', {method: 'get'}).then((res) => {
            return res.json();
        }).then((data) => {
            displayPosts(data, display);
            posts = data;
        });
    }
    

    document.getElementById("logo").onclick = ()=>{
          window.location.href = "/";
    };
    document.getElementById("signin_btn").onclick = ()=>{
          window.location.href = "/signin";
    };
    document.getElementById("register_btn").onclick = ()=>{
        window.location.href = "/register";
    };

    //search button
    $("#search_btn").click(()=>{
        const userSearch = $("#search_field").val();
        window.location.href = `/search?str=${userSearch}`;
    });
    //display posts
    const displayPosts = (data, ulName) => {
        for(var key in data){
            if(data[key].country.toUpperCase() == country.toUpperCase()){
                
                ulName.append(postTemplate(data[key],key));
                showPostClickListner(data[key],key);
                
            }
            
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
            console.log(post.title);
            window.location.href = `/posts?id=${id}`;
        }
        
        
    }
    var country;
    var city;
    
    const findLocation = () => {
        $.ajax('http://ip-api.com/json')
        .then(
            function success(response) {
                country = response.country;
                city = response.city;
                retrieve();
            },
      
            function fail(data, status) {
                console.log('Request failed.  Returned status of',
                            status);
            }
        );
    }
    
    findLocation();

    
    
});