const admin = require('firebase-admin');
const express = require('express');
const body_parser = require('body-parser');
const path = require('path');


const serviceAccount = require("C:/Users/Behdad/Desktop/behfood-af5a2-firebase-adminsdk-bmrpm-eee95f86c7.json");
const app = express();
app.use(body_parser.json());
app.set('view engine', 'ejs');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://behfood-af5a2.firebaseio.com',
    storageBucket: "behfood-af5a2.appspot.com"
  });

const db = admin.database();
const bucket = admin.storage().bucket();
//first-page
app.use(express.static(__dirname + "/frontend"));
//-----------

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname+"/frontend/home.html"));
});

//retrieving the data
var ref = db.ref("Posts");

// Attach an asynchronous callback to read the data at our posts reference
ref.on("value", function(snapshot) {
  
  app.get('/getPosts', (req,res) => {
      res.json(snapshot.val());
  });
  //searched posts
  app.get('/search', (req,res) => {
    const searchInput = req.query.str;
    var found = false;
    const posts = snapshot.val();
    var selectedPosts = [];
    for(var email in posts){
        if(posts[email].title.toUpperCase().includes(searchInput.toUpperCase())){
            //after_search.append(postTemplate(posts[email],email));
            //showPostClickListner(posts[email],email);
            found = true;
            selectedPosts.push(posts[email]);
        }
    }
    res.render('searchedPosts', 
      {
        searchStr: searchInput,
        data : selectedPosts,
        found: found
      });
  });
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
////---------
app.get("/check_user/:email", (req,res) => {
  admin.database().ref('Users/').once('value').then((snap) => {
    const email = req.params.email.replace(/\./g, ",");
    var exist = false;
    for(var key in snap.val()){
      if(key == email){
        exist = true;
      }     
    }
    res.send(exist);
  });
});
//write to posts section firebase//posting new post
app.post('/writeinPosts', (req,res) => {
  const data = req.body;
  admin.database().ref('/Posts/' + data.refrence).set({
    city: data.city,
    country: data.country,
    state: data.state,
    email: data.email,
    imageurl: data.imageurl,
    price: data.price,
    refrence: data.refrence,
    text: data.text,
    title: data.title
  });
});

//register user
app.post('/writeUser', (req,res) => {
  admin.database().ref('Users/' + req.body.email.replace(/\./g, ",")).set({
    email: req.body.email,
    country: req.body.country,
    city: req.body.city,
    username: req.body.username
  });
});
//post button
app.get('/post', (req,res) => {
  res.sendFile(path.join(__dirname, "/frontend/newPost.html"));
});
//signin
app.get("/signin", (req,res) => {
  res.sendFile(path.join(__dirname+"/frontend/signin.html"));
});
//register
app.get("/register", (req,res) => {
  res.sendFile(path.join(__dirname+"/frontend/register.html"));
});
//post clicked
app.get('/posts', (req,res) => {
  var ref = db.ref(`Posts/${req.query.id}`);
  
  
  if(req.query.id.includes("GMT ")){
    let index = req.query.id.indexOf("GMT")+3;
    let newSt = req.query.id.substr(0,index) + "+" + req.query.id.substr(index+1);
    ref = db.ref(`Posts/${newSt}`);
  }
  ref.on("value", (snapshot) => {
    const data = snapshot.val();

    res.render("post",{
      title: data.title,
      imageurl: data.imageurl,
      text: data.text,
      city: data.city,
      country: data.country,
      postalcode: data.postalcode,
      price: data.price,
      email: data.email
    });
  });
});

//user's profile
app.get('/profile', (req,res) => {
  res.sendFile(path.join(__dirname, "/frontend/user-post.html"));
});

var ref = db.ref("restricted_access/secret_document");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});

app.listen(5000, () => {
    console.log('server is running');
});
/*
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
*/