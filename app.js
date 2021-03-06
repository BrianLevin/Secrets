// config is to access variables
require("dotenv").config();

const express = require("express");

const bodyParser = require("body-parser");

const ejs = require("ejs");

const mongoose = require("mongoose");
// assigns client id  info assioated with client is stored on id
const session = require("express-session");
// authentication middleware for node js
const passport = require("passport");
// simpliesfiies  bulidng user name and password with mongoose and automatically hash salt and hash feilds
const passportLocalMongoose = require("passport-local-mongoose");
// find a user or create auser someone already created  the id
const findOrCreate = require("mongoose-findorcreate");

// otha access

var GoogleStrategy = require("passport-google-oauth20").Strategy;

// random hashes
const saltRounds = 10;

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

// uss and utilze  express session
app.use(
  session({
    secret: "Our little secret",
    resave: false,
    saveUninitialized: false,
  })
);
///// 14 min mark in video
// intiaize pass port to start using for authentification
app.use(passport.initialize());
// use passport to also set up  and manage the session
app.use(passport.session());
// got rid of depreciated warnings for future versions
mongoose.connect(process.env.MONGODB_URI|| "mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// created from mongoose.schema class to encrypt data
// got rid of depreciation warning
mongoose.set("useCreateIndex", true);
// mongoose schema which will hold all the db values
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String,
});
// use to hash and salt passwards and save users  in mongo db database
userSchema.plugin(passportLocalMongoose);

userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
// use passportlocal mongoose to use the schema

// authentiicat users and username and passwords
passport.use(User.createStrategy());
// serialize creates cookie and stores identification
// serialize creates cookie and stores identification
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
// deconstructing the data
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// utilize google authentification and strategy to login user
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      // retieving info from their user info and not google + due to depreciation
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    // acess token gets data related to user  profile contains email, google id  and anything else we want access to
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      // find a user id with that id in our database or create them if they dont exist
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

app.get("/", function (req, res) {
  res.render("home");
});

app.get(
  "/auth/google",
  // use passport to authenticate user using google strategy then get users profile
  passport.authenticate("google", { scope: ["profile"] })
);

// once google auth is sucessful, this will route them to the secrets page
app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect secrets.
    res.redirect("/secrets");
  }
);

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/secrets", function (req, res) {
  // find where all secrets are to be displayed on page
  // pick secrets where user is not equal to null
  User.find({ secret: { $ne: null } }, function (err, foundUsers) {
    if (err) {
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("secrets", { usersWithSecrets: foundUsers });
      }
    }
  });
});

// route to submit secrets page
app.get("/submit", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.post("/submit", function (req, res) {
  // "secret" will be grabed from the name in the submit.ejs file
  const submittedSecret = req.body.secret;

  console.log(req.user.id);
  // find the user who posted the secret
  User.findById(req.user.id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      // this will post and save the secret on the mongo db
      if (foundUser) {
        foundUser.secret = submittedSecret;
        foundUser.save(function () {
          res.redirect("/secrets");
        });
      }
    }
  });
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

// make post request to register route
app.post("/register", function (req, res) {
  // register comes from passport local mongoose package
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        // redirect to try again
        res.redirect("/register");
        // type of authentification is local
        // succesfully registered and autheticated user, managed to set up cookie to see if they are logged in  that saved current logged in session and routed to secrets page
      } else {
        passport.authenticate("local")(req, res, function () {
          // can automatically view secrets page even if they still are logged in
          res.redirect("/secrets");
        });
      }
    }
  );
});
// check if user is already in the database
app.post("/login", function (req, res) {
  // created new user
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  // login user and authenticate them

  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      // redirect to secrets route once authenticated
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
