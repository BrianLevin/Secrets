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

app.use(passport,initialize());

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
    



})
// check if user is already in the database
app.post("/login", function(req,res){

   


});












 app.listen(3000, function(){

    console.log("Server started on port 3000")
 })