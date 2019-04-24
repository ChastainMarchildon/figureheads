const express = require('express');
const listingController = require('../controllers/listingController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const passport = require('passport');
const nodemailer = require('nodemailer')

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

router.get('/photographers', userController.getPhotographers);
router.post('/admin/editPhotographer/:id', userController.updatePhotographer);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/listings');
});



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



module.exports = router;
