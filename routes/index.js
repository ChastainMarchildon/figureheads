const express = require('express');
const listingController = require('../controllers/listingController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const passport = require('passport');
const nodemailer = require('nodemailer')
const async = require('async');
const crypto = require('crypto');
const User = require('../models/User');
const http = require("http");
const path = require("path");
const fs = require("fs");
const sendEmail = require('../public/js/send-email');
const cloudinary = require('cloudinary').v2;

const router = express.Router();


/* GET home page. */
router.get('/', listingController.homePage);
router.get('/subscribe', userController.subscribe);

router.get('/listings', listingController.getListings, userController.getFeaturedPhotographers);
router.get('/categoryListings/:category', listingController.getCategories);
router.get('/viewlisting/:id', listingController.viewListing);

//redirects the user to admin page based on what type of profile they have
router.get('/admin', authController.isLoggedIn,(req, res, next) => {
  req.routeStrategy.admin(req, res, next);
});
router.get('/admin/delete/:id', listingController.deleteListing);
router.get('/admin/edit/:id', listingController.editListing);
router.post('/admin/edit/:id', listingController.updateListing);

router.get('/add', authController.isLoggedIn, listingController.addListing);
router.post('/add', authController.isLoggedIn, listingController.createListing);

router.get('/chooseRegistry', userController.chooseRegistry);
router.get('/register', userController.registerForm);
router.post('/register', userController.register, authController.login);
router.get('/gethired', userController.photoRegisterForm);
router.post('/gethired', userController.registerPhotographer,userController.newUser, authController.login);
router.get('/featured', userController.featured);

router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/viewprofile/:id', userController.viewProfile);
router.post('/viewprofile/:id', userController.updateProfile);

router.get('/about', listingController.getAboutUs);
router.get('/blogList', listingController.getBlogList);
router.get('/viewBlogPost/:id', listingController.viewBlogPost);
router.get('/addBlog', authController.isLoggedIn, listingController.addBlog);
router.post('/addBlog', authController.isLoggedIn, listingController.createBlog);

router.get('/contact/:id',authController.isLoggedIn,listingController.contact);
router.get('/contactUs', userController.contactUs);

router.get('/photographers', userController.getPhotographers, userController.getProfilePictures);
router.get('/admin/editPhotographer/:id', userController.editPhotographer);
router.post('/admin/editPhotographer/:id', userController.updatePhotographer);
router.get('/portfolio/:id',userController.getPortfolio);
router.get('/localPhotographers/:location', userController.getLocalPhotographers);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/listings');
});

router.get('/forgot', userController.forgotPassword);

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      //req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {
      user: req.user,
      title: 'Reset Password'
    });
  });
});


/**Code for handling emails and contact forms */
router.post('/contact/send',(req,res)=>{
  //Gets the information from the contact form and inserts it into an email
  const output = `<p>A photographer from Fotio.ca has sent you a message!</p>
                  <h3>Contact Details</h3>
                  <ul>
                    <li>Name: ${req.body.name}</li>
                    <li>Email: ${req.body.email}</li>
                    <li>Phone Number: ${req.body.phone}</li>
                  </ul>
                  <h3>Message</h3>
                  <p>${req.body.message}</p>`;

  let transporter = nodemailer.createTransport({
                    host: 'mail.privateemail.com',
                    //port:25,
                    //port:465,
                    port:587,
                    //port: 25,
                    secure: false,  
                    //service:'gmail',
                    auth: {
                        user: 'support@fotio.ca', 
                        pass: 'a5516coca33'
                        //pass: 'hususeyrzagvizjr' 
                    }
                });
            
                // setup email data with unicode symbols
  let mailOptions = {
                    from: '"Fotio" <support@fotio.ca>', 
                    to: req.body.posterEmail, 
                    subject: 'A new message from a photographer at Fotio.ca',  
                    html: output // inserts the contact info and message into the email
                };       
  transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                    res.render('sent',{
                      title:"Email Confirmed",
                      user: req.user
                    });
              });
});

/**Forgot password mail code *********************************************************************************/

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ username: req.body.email },(err, user) => {
        if (!user) {
          console.log(req.body.email);
         // req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }
        console.log(req.body.email);
        console.log(user);

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
 
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'mail.privateemail.com',
        //port:25,
        //port:465,
        port:587,
        //port: 25,
        secure: false,  
        //service:'gmail',
        auth: {
            user: 'support@fotio.ca', 
            pass: 'a5516coca33'
            //pass: 'hususeyrzagvizjr' 
        }
    });
      var mailOptions = {
        to: user.username,
        from: 'support@fotio.ca',
        subject: 'Fotio.ca Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        res.render('resetConfirmation',{
          title:"Email Confirmed",
          user: req.user
        });
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});


/** confirms password was reset with an email */
router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          //req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        user.setPassword(req.body.password, function(){
          user.save();
          req.logIn(user, function(err) {
            done(err, user);
          });
      });
    });
  },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'mail.privateemail.com',
        //port:25,
        //port:465,
        port:587,
        //port: 25,
        secure: false,  
        //service:'gmail',
        auth: {
            user: 'support@fotio.ca', 
            pass: 'a5516coca33'
            //pass: 'hususeyrzagvizjr' 
        }
    });
      var mailOptions = {
        to: user.username,
        from: 'support@fotio.ca',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        //req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});



/** Code for handling image saving and rendering */
/*

const multer = require("multer");

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "/public/images"
});


router.post(
  "/uploadProfilePicture",
  upload.single("file"),
  (req, res) => {
    const tempPath = req.file.path;
    const userID = req.body.userID;
    const targetPath = path.join(__dirname, "../uploads/" + userID + ".png");

    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
      fs.rename(tempPath, targetPath, err => {
        if (err) {
          console.log(targetPath);
          return handleError(err, res);
        }
        
        console.log(req.body);
        res.redirect('/admin');
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) {
          return handleError(err, res);
        }

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    }
  }
);

router.get("/image.png", (req, res) => {
  const userImage = req.body
  console.log(userImage);
  res.sendFile(path.join(__dirname, "../uploads/image.png"));
});
*/

module.exports = router;
