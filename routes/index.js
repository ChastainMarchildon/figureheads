const express = require('express');
const listingController = require('../controllers/listingController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const passport = require('passport');
const nodemailer = require('nodemailer')
const http = require("http");
const path = require("path");
const fs = require("fs");

var UserRouteStrategy = {
  home: listingController.admin
};

var AdminRouteStrategy = {
  home: userController.photoAdmin
};

const router = express.Router();


/* GET home page. */
router.get('/', listingController.homePage);

router.get('/listings', listingController.getListings);
router.get('/categoryListings/:category', listingController.getCategories);

//redirects the user to admin page based on what type of profile they have
router.get('/admin', authController.isLoggedIn,(req, res, next) => {
  req.routeStrategy.admin(req, res, next);
});
router.get('/admin/delete/:id', listingController.deleteListing);
router.get('/admin/edit/:id', listingController.editListing);
router.post('/admin/edit/:id', listingController.updateListing);

router.get('/add', authController.isLoggedIn, listingController.addListing);
router.post('/add', authController.isLoggedIn, listingController.createListing);

router.get('/register', userController.registerForm);
router.post('/register', userController.register, authController.login);

router.get('/gethired', userController.photoRegisterForm);
router.post('/gethired', userController.registerPhotographer, authController.login);

router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/viewlisting/:id', listingController.viewListing);

router.get('/contact/:id',authController.isLoggedIn,listingController.contact);

router.get('/photographers', userController.getPhotographers, userController.getProfilePictures);
router.post('/admin/editPhotographer/:id', userController.updatePhotographer);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/listings');
});


/**Code for handling emails and contact forms */
router.post('/contact/send',(req,res)=>{
  //Gets the information from the contact form and inserts it into an email
  const output = `<p>You have a new message</p>
                  <h3>Contact Details</h3>
                  <ul>
                    <li>Name: ${req.body.name}</li>
                    <li>Email: ${req.body.email}</li>
                    <li>Phone Number: ${req.body.phone}</li>
                  </ul>
                  <h3>Message</h3>
                  <p>${req.body.message}</p>`;

  let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,  
                    service:'gmail',
                    auth: {
                        user: 'chastainrgm@gmail.com', 
                        pass: 'hususeyrzagvizjr' 
                    }
                });
            
                // setup email data with unicode symbols
  let mailOptions = {
                    from: '"Test App" <chastainrgm@gmail.com>', 
                    to: req.body.posterEmail, 
                    subject: 'Message from your Test App',  
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



/** Code for handling image saving and rendering */

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
  upload.single("file" /* name attribute of <file> element in your form */),
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



module.exports = router;
