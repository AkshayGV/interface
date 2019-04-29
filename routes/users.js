const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');
const db = require('../util/db');

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// Load Login page
router.get('/login', (req, res) => {
  const title = 'Login';
  res.render('users/login', {
    title: title
  });
});

// Load Register page
router.get('/register', ensureAuthenticated,(req, res) => {
  // add logic to ensure the user is ROOT
  var access = res.locals.user.access;
  if(access == "root"){
      const title = 'Registration';
      res.render('users/register', {
      title: title
    });
  }
  else{
    return res.redirect('/');
  }
});

// Login Form POST
router.post('/login', (req, res, next) => {  
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next); 
});

// Register Form POST
router.post('/register', ensureAuthenticated,(req, res) => {
  let errors = [];
  const title = 'Registration';
  if(req.body.password != req.body.password2){
    errors.push({text:'Passwords do not match'});
  }

  if(req.body.password.length < 4){
    errors.push({text:'Password must be at least 4 characters'});
  }

  if(errors.length > 0){
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
      title: title
    });
  } else {
    User.findOne({email: req.body.email})
      .then(user => {
        if(user){
          req.flash('error_msg', 'Email already regsitered');
          res.redirect('/users/register');
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            access:req.body.access,
            access_level:req.body.access_level
          });
          
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'Created A new user Successfully');
                  res.redirect('/');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  }
});

//Logout get method
router.get('/logout',(req,res)=>{
  // db.end();
  req.logOut();
  req.flash('success_msg',"Successfully logged out!");
  res.redirect('/users/login');
})

module.exports = router;