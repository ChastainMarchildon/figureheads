const passport = require('passport');
const User = require('../models/User');
const Grid = require('gridfs-stream');
const fs = require('fs');
const sendEmail = require('../public/js/send-email');
const cloudinary = require('cloudinary').v2;



exports.photoRegisterForm = (req, res) => {
  res.render('gethired', {
    title: 'Register as a Photographer',
    warning: '',
    user: req.user,
  });
};

exports.photoAdmin = (req, res) => {
  res.render('photoadmin', {
    title: 'Account Management',
    warning: '',
    user: req.user,
  });
};

exports.registerForm = (req, res) => {
  res.render('register', {
    title: 'Register',
    warning: '',
    user: req.user,
  });
};

exports.subscribe = (req, res) => {
  res.render('subscribe', {
    title: 'Subscribe as a Photographer',
    warning: '',
    user: req.user,
  });
};

exports.registerPhotographer = (req, res, next) => {

  const user = new User({
    username: req.body.username, 
    name:req.body.name,
    portfolioLink : req.body.portfolio, 
    photographer : req.body.photographer, 
    instagram : req.body.instagram,
  });

  User.register(user,req.body.password, (err, account) => {
    if (err) {
      console.log(err);
      // needed to say 'return' below otherwise node will complain that headers already sent.
      return res.render('gethired', {
        title: 'Register as a Photographer',
        warning: 'Sorry, that username is already taken.  Try again.',
        user: req.user,
      });
    }
    next(); /* success */
  });
};

exports.register = (req, res, next) => {
  const user = new User({ username: req.body.username, name:req.body.name, phoneNumber:req.body.phoneNumber });

  User.register(user, req.body.password, (err, account) => {
    if (err) {
      console.log(err);
      // needed to say 'return' below otherwise node will complain that headers already sent.
      return res.render('register', {
        title: 'Register',
        warning: 'Sorry, that username is already taken.  Try again.',
        user: req.user,
      });
    }
    next(); /* success */
  });
};

exports.loginForm = (req, res) => { 
  const messages = req.session.messages || [];

  // clear session message
  req.session.messages = [];
  //console.log(req.session.passport.user)
  res.render('login', {
    title: 'Login',
    messages,
    user: req.user,
  });
};

exports.getPhotographers = (req, res) => {
  User.find({photographer:"Yes"},(err, users) => {
    if (err) {
      res.render('error');
    } else {
      res.render('photographers', {
        title: 'Our Photographers',
        users,
        user: req.user,
      });
    }
  });
};

exports.editPhotographer = (req, res) => {
  User.findById({ _id: req.params.id }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      res.render('editPhotographer', {
        title: 'Edit Setting',
        user,
        isActive: 'admin',
        user: req.user,
      });
    }
  });
};

exports.getProfilePictures  = (req, res) => {
  res.sendFile(path.join(__dirname, "../uploads/"+ req.user._id + ".png"));
}

exports.updatePhotographer = (req, res) => {
  User.update({ _id: req.params.id }, req.body, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/admin');
    }
  });
};

exports.viewProfile = (req,res) =>{
  User.findById({ _id: req.params.id},(err, user) =>{
    if (err) {
      console.log(err);
    } else {
      res.render('viewprofile', {
        title: 'Profile',
        user,
        isActive: 'admin',
        user: req.user,
      });
    }
  });
};


exports.updateProfile = (req, res) => {
  User.update({ _id: req.params.id }, req.body, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/admin');
    }
  });
};

exports.forgotPassword = (req, res) => {
  res.render('forgot', {
    user: req.user,
    title: 'Forgot Password'
  });
};

exports.contactUs = (req,res,next) =>{
  res.render('contactUs',{
      title:'Contact Us',
      user:req.user
  });
};

exports.newUser = (req,res,next) =>{
  sendEmail('chastainrgm@gmail.com','New User',req.body.username);
  res.render('index',{
    title:'Fotio',
    user:req.user
  })
}


/*****************************************************Portfolio Controls */
/**Uses cloudinary image link list to generate a json list of images uploaded wioth a users id as a tag */
exports.getPortfolio = (req,res) =>{
  User.findById({ _id: req.params.id},(err, user) =>{
    if (err) {
      console.log(err);
    } else {
      images = cloudinary.image(user._id +".json", {type: "list"});
      res.render('portfolio', {
        title: user.name + ' Portfolio',
        images,
        user,
        isActive: 'admin',
        user: req.user,
      });
    }
  });
};
