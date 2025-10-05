const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    time:{
        type:String,
        required:true,

    },
    date:{
        type:String,
        required:true
    },
    category:{
        type:String,
        default: 'Personal'
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now
    },
    updateAt:{
        type:Date,
        default:Date.now
    }
})

reminderSchema.pre('save',function(next){
    this.updateAt = Date.now();
    next();
})

module.exports = mongoose.model('Reminder',reminderSchema);