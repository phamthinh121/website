const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const isLoggedIn = require('../middleware/logged');
const Task = require('../models/task')


router.get('/', (req, res) => {
  res.status(200).json({messag: 'ok'});
})
// router.get('/', forwardAuthenticated, async (req, res) => {
//   console.log('get task')
//   const tasks = await Task.find({})
//   res.render('welcome',{tasks: tasks})
// });


router.get('/home', ensureAuthenticated,async (req, res) =>{
const tasks = await Task.find({})

res.render('home',{
  ...req.user,
  tasks: tasks
})
});

router.get('/product',isLoggedIn,(req,res)=>{
  res.render('product')
})

router.post('/product',isLoggedIn, async (req, res) => {
  const task = new Task(req.body)

  try {
      await task.save()
      res.redirect('product')
  } catch (e) {
      throw e;
  }
})

module.exports = router;
