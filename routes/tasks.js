const express = require('express')
const Task = require('../models/task')
const multer = require('multer');
const sharp = require('sharp');
const session = require('express-session');
const router = new express.Router();
const User = require('../models/User')
const isLoggedIn = require('../middleware/logged')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Cart = require('../models/Cart');

router.post('/tasks', async (req, res) => {
    // const task = new Task(req.body)
const task = new Task({
    ...req.body,
owner: user._id
})
    try {
        await task.save()
        console.log(task)
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})
//

//
const upload = multer({
    limits:{
      
        fileSize:10000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('please upload a images'))
        }
        cb(undefined,true)
    }
  })
 //
router.post('/create-product',upload.single('anhsp'),isLoggedIn, async (req, res) => {
    try{
        const title = req.body.title;
        const description = req.body.description;
        const price = parseFloat(req.body.price).toFixed(2);
        const saleOff = parseFloat(req.body.saleOff).toFixed(2);
        const category = req.body.category;
        const owner = req.body.owner;
        const task = new Task({title: title, description: description, price: price, saleOff: saleOff,category: category,owner: owner});
        // console.log(owner)
        // console.log(task);
        if(req.file){
            const buffer = await sharp(req.file.buffer).resize({ width: 140, height: 140 }).png().toBuffer();
            task.images = buffer;
            // console.log(req.file)
        }
        await task.save()
        // console.log(task)
        res.redirect('/users/my-product')
    } catch(e) {
        console.log(e)
        res.status(400).send({ e: e.message })
    }
})

router.get('/tasks/:id/images', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)

        if (!task || !task.images) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(task.images)
    } catch (e) {
        res.status(404).send()
    }
})
router.get('/bakery',isLoggedIn, async (req, res) => {
 
        const tasks = await Task.find({category:"bakery"})
       
        
        res.render('bakery',{tasks: tasks})
})
router.get('/cake',isLoggedIn,async (req, res) => {
 
        const tasks = await Task.find({category:"cake"})
       
        
        res.render('cake',{tasks: tasks})
})
router.get('/birthday-cake',isLoggedIn, async (req, res) => {
 
        const tasks = await Task.find({category:"birthday-cake"})
       
        
        res.render('birthday-cake',{tasks: tasks})
})
router.get('/bread',isLoggedIn, async (req, res) => {
 
        const tasks = await Task.find({category:"bread"})
       
        
        res.render('bread',{tasks: tasks})
})
router.get('/dumplings',isLoggedIn, async (req, res) => {
 
        const tasks = await Task.find({category:"dumplings"})
       
        
        res.render('dumplings',{tasks: tasks})
})
router.get('/detail.:idProduct', async (req,res)=>{
    const idView = req.params.idProduct;
    if(!req.session.viewProduct){
        req.session.viewProduct = [];
    }
    if(req.session.viewProduct.indexOf(idView)==-1){
        req.session.viewProduct.push(idView);
    }
    

    const tasks = await Task.find({})
    res.render('detail',{idProduct:req.params.idProduct,list: req.session.viewProduct,tasks:tasks})
});

router.get('/list-view-product', async (req, res) => {
 
 
    const tasks = await Task.find({})
    
    res.render('view-product',{list: req.session.viewProduct,tasks:tasks})
})

router.get('/users/my-product',isLoggedIn, async (req,res)=>{
try{
    const session={
        user:req.user
        };
    const ss = session.user._id               
    const tasks = await Task.find({owner: ss});
    res.render('my-product',{tasks})
} catch(e){
    res.status(500).json({})
}
})

router.get('/remove-task/:id',isLoggedIn,async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id })

        if (!task) {
            res.status(404).send()
        }

        res.redirect('/users/my-product')
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router
