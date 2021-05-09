// config is to access variables
require("dotenv").config()

const express = require("express");


console.log(process.env.API_KEY)

const bodyParser= require("body-parser");

const ejs= require("ejs");

const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

// random hashes
const saltRounds= 10;


const app = express();

 app.use(express.static("public"));

 app.set("view engine", "ejs");

 app.use(bodyParser.urlencoded({extended: true}));



 mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
                   // created from mongoose.schema class to encrypt data
 const userSchema =  new mongoose.Schema ({
email: String,
password: String

 });


 // added mongoose ecrypt as a plgin to schema and pass secret as a javascript object
                                   // grab secret from env file               // only encrypt password


 const User = new mongoose.model("User", userSchema)





app.get ("/", function(req,res){


    res.render("home")
})


app.get ("/login", function(req,res){


    res.render("login")
})


app.get ("/register", function(req,res){


    res.render("register")
})

// make post request to register route
app.post("/register", function(req,res){
    // create user once generated hash
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
// document to create user
const newUser = new User({

    email: req.body.username,
    // hash function to turn that into irreversible hash
    password: hash
});

newUser.save( function(err){
if(err){
console.log(err);
} else{
// render secrets page once user is logged in
res.render("secrets")
}

})

    });



})
// check if user is already in the database
app.post("/login", function(req,res){

    const username=  req.body.username;
                 // hash function
    const password = md5(req.body.password);

// does email have the same data as username
    User.findOne({email: username}, function(err,foundUser){
if(err){
    console.log(err);
} else {
    if(foundUser){
        // if found user password = the one in database
        if(foundUser.password=== password) {
res.render("secrets")

        }
    }
}

    });



});








 app.listen(3000, function(){

    console.log("Server started on port 3000")
 })