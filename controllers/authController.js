const passport = require('passport');
const mongoose = require('mongoose');
const listingController = require('../controllers/listingController');
const userController = require('../controllers/userController');

var UserRouteStrategy = {
  admin: listingController.admin
};

var PhotoRouteStrategy = {
  admin: userController.photoAdmin
};

const User = mongoose.model('User');

exports.isLoggedIn = (req, res, next) => {
  // first check if user is authenticated
  if (req.isAuthenticated()) {
    const isPhotographer = req.query.photographer = "True"
    req.routeStrategy = req.user.photographer == "Yes" ? PhotoRouteStrategy : UserRouteStrategy 
    console.log(req.user);
    next();
    return;
  }
  res.redirect('/login');
};

exports.isPhotographer = (req, res, err) => {
  //check if user is a photographer
  if(err){
    console.log(err);
  }
  if (req.body.photographer == "Yes") {
    next();
    return;
  }
  res.redirect('/login');
};

exports.photoLogin = passport.authenticate('local', {
  successRedirect: '/photoadmin',
  failureRedirect: '/login',
  failureMessage: 'Invalid Login',
});

exports.login = passport.authenticate('local', {
  successRedirect: '/listings',
  
  failureRedirect: '/login',
  failureMessage: 'Invalid Login',
});


