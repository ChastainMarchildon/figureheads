const Listing = require('../models/Listing');
const User = require('../models/User');
const url = require('url');

exports.homePage = (req, res) => {
  res.render('index', { title: 'Home', user: req.user });
};

exports.getListings = (req, res) => {
  Listing.find((err, listings) => {
    if (err) {
      res.render('error');
    } else {
      res.render('listings', {
        title: 'All Listings',
        listings,
        user: req.user,
      });
    }
  });
};

exports.admin = async (req, res) => {
  // use listing model to query db for listing data
  const listings = await Listing.find({userID: req.user.id}).sort({ title: 'asc' });

  res.render('admin', {
    title: 'Admin',
    listings,
    user: req.user,
  });
};



exports.addListing = (req, res) => {
  res.render('addListing', {
    title: 'Add Listing',
    user: req.user,
  });
};

exports.createListing = async (req, res) => {
  try {
    const listing = new Listing(req.body);
    await listing.save();
    res.redirect('/listings');
  } catch (err) {
    console.log(err);
  }
};

exports.deleteListing = (req, res) => {
  Listing.findByIdAndRemove(
    { _id: req.params.id },
    async (err, listingJustDeleted) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/admin');
      }
    },
  );
};

exports.editListing = (req, res) => {
  // use Listing model to find selected document
  Listing.findById({ _id: req.params.id }, (err, listing) => {
    if (err) {
      console.log(err);
    } else {
      res.render('editListing', {
        title: 'Edit',
        listing,
        isActive: 'admin',
        user: req.user,
      });
    }
  });
};

exports.updateListing = (req, res) => {
  // get year from last 3 characters of imageUrl
  req.body.year = req.body.imageUrl.substr(-4);

  Listing.update({ _id: req.params.id }, req.body, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/admin');
    }
  });
};

//Finds the listing based on the ID associated in the Listings page
exports.viewListing = (req,res) =>{
  Listing.findById({ _id: req.params.id},(err, listing) =>{
    if (err) {
      console.log(err);
    } else {
      res.render('viewlisting', {
        title: 'View Listing',
        listing,
        isActive: 'admin',
        user: req.user,
      });
    }
  });
};

exports.contact = (req,res,next) =>{
  const contact = User.findById({_id:req.params.id});

  User.findById({_id:req.params.id},(err,user) =>{
    if(err){
      console.log(err);
    } else{
      res.render('contact',{
      title:'Contact Poster',
      email: user.username,
      //Passing req.user will only show a user in the nav if they were logged in previously
      user: req.user
      });
    }
  });
};

