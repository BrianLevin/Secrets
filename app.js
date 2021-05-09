// config is to access variables
require("dotenv").config()

const express = require("express");


console.log(process.env.API_KEY)

const bodyParser= require("body-parser");

const ejs= require("ejs");

const mongoose = require("mongoose");

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose= require("passport-local-mongoose")



// random hashes
const saltRounds= 10;


const app = express();

 app.use(express.static("public"));

 app.set("view engine", "ejs");

 app.use(bodyParser.urlencoded({extended: true}));

 // uss and utilze  express session
app.use(session({
secret: "Our little secret",
resave: false,
saveUninitialized: false


}));
// intiaize pass port to start using for authentification
app.use(passport,initialize());
// use passport to also set up  and manage the session
app.use(passport.session());

 mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
                   // created from mongoose.schema class to encrypt data
 const userSchema =  new mongoose.Schema ({
email: String,
password: String

 });
// use to hash and salt passwards and save users  in mongo db database
 userSchema.plugin(passportLocalMongoose);


 // added mongoose ecrypt as a plgin to schema and pass secret as a javascript object
                                   // grab secret from env file               // only encrypt password


 const User = new mongoose.model("User", userSchema)
// use passportlocal mongoose to use the schema

// authentiicat users and username and passwords
 passport.use(User.createStrategy());
// serialize creates cookie
 passport.serializeUser(User.serializeUser());
 // passport destroys the cookie to get info inside cookie to authentticate user
 passport.deserializeUser(User.deserializeUser());



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
    



})
// check if user is already in the database
app.post("/login", function(req,res){

   


});












 app.listen(3000, function(){

    console.log("Server started on port 3000")
 })