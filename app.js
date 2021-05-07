const express = require("express");

const bodyParser= require("body-parser");

const ejs= require("ejs");

const mongoose = require("mongoose");

const app = express();

 app.use(express.static("public"));

 app.set("view engine", "ejs");

 app.use(bodyParser.urlencoded({extended: true}));



 mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

 const userSchema =  {
email: String,
password: String

 };

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
// document to create user
    const newUser = new User({

        email: req.body.username,
        password: req.body.password
    });

    newUser.save( function(){
if(err){
    console.log(err);
} else{
    // render secrets page
    res.render("secrets")
}

    })

})








 app.listen(3000, function(){

    console.log("Server started on port 3000")
 })