const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
     
    },
    price: {
        type: Number,
        required: true
    },
    saleOff: {
        type: Number,
        default: 0,
     
    },
    category:{
        type: String,
        required:true,
        trim:true,
        lowercase:true
    },images:{
        type:Buffer
    }
    ,  owner: {
        type: String,
        // required:true,
        ref:'User'
    }
})
const Task = mongoose.model('Task', taskSchema)
//  Task.find({owner:"5eda6a8a34822628fc934345"}).exec((err,tasks)=>{
//     console.log(tasks); 
//   })

module.exports = Task