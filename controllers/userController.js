const passport = require('passport');
const User = require('../models/User');
const Grid = require('gridfs-stream');
const fs = require('fs');



exports.photoRegisterForm = (req, res) => {
  res.render('gethired', {
    title: 'Register as a Photographer',
    warning: '',
    user: req.user,
  });
};

exports.photoAdmin = (req, res) => {
  res.render('photoadmin', {
    title: 'Photo Admin',
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

exports.registerPhotographer = (req, res, next) => {

  const user = new User({
    username: req.body.username, 
    name:req.body.name,
    portfolioLink : req.body.portfolio, 
    photographer : req.body.photographer, 
  });

  User.register(user,profilePicture,req.body.password, (err, account) => {
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
  const user = new User({ username: req.body.username, name:req.body.name });

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