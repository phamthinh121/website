const express = require('express');
const router = express.Router();
const bscrypt = require('bcryptjs');
const passport = require('passport')
const ObjectID = require('mongodb').ObjectID;
const {sendWelcomeEmail,sendGoodbyeEmail} = require ('../src/email/account')
const auth = require('../middleware/auth');
const User = require('../models/User');
const isLoggedIn = require('../middleware/logged')
const jwt = require('jsonwebtoken');


router.get('/login',(req,res)=>{
    res.render('login')
});


router.get('/register',(req,res)=>{
    res.render('register')
});


router.post('/register',async (req,res)=>{
    const {name,email,age,password,password2} = req.body;
    let errors=[]; 
    
    if(!name|| !email||age|| !password || !password2){
        errors.push({message:'please fill in all field! '});
    }
    
    if(password !==password2){
        errors.push({message:'password do not match!'});
    }
   
    if(password.lenght <6 ){
        errors.push({message:'password must be least 6 charactors'});
    }
    if(age <0 ){
        errors.push({message:'age must be a possible'});
    }
    if(errors.lenght>0){
    res.render('register',{
        errors,
        name,
        email,
        password,
        password2
    })
}
    else{
    
        User.findOne({email:email})
        .then(user=>{
            if(user){
           
                errors.push({message:'email is already register!'})
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                const user = new User({
                    name,
                    email,
                    password
                });
                sendWelcomeEmail(user.email,user.name)
               
                bscrypt.genSalt(10,(err,salt)=>
                bscrypt.hash(user.password,salt,(err,hash)=>{
                    if(err) throw err;
                
                    
                    
                    const token = user.generateAuthToken()
                
                   
                    .then(user=>{
                        req.flash('suc_message','you are register successfull, can login now');
                        console.log(req.user)
                        res.redirect('/users/login')
                        
                    })
                    .catch(err=>{
                        console.log(err)
                    });
                    
                }))
            }
        });
    }
})

// login handle
router.post('/login',(req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/home',
      
      failureRedirect: '/users/login',
      
      failureFlash: true
      
    })(req, res, next);
  });

router.get('/logout',isLoggedIn, (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  });


router.get('/sell-product',isLoggedIn,(req,res)=>{
    const ss = session;
    const id = ss.user._id
   
    res.render('product',{id:id})
  })

router.get('/profile',isLoggedIn,function(req,res){
    res.render('profile',{id:req.user._id,name:req.user.name,email:req.user.email,password:req.user.password})
})

router.get('/edit-profile',isLoggedIn,(req,res)=>{
    // const user = req.user
    // console.log(user)
    res.render('edit-profile')
})

router.post('/edit-profile', isLoggedIn, async (req, res) => {
    const updates = Object.keys(req.body)
    try {
        
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

    } catch (e) {
        res.status(400).send(e)
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
    } catch (e) {
        res.status(400).send(e)
    }
})
router.get('/account',async(req,res)=>{
    res.render('account')
})
module.exports = router;
