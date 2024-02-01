const mongoose = require('mongoose')

const SubTaskSchema = mongoose.Schema({
    task_id : {type:mongoose.Types.ObjectId},
    title : {type:String},
    archived: {type:Boolean,default:false},
    status : {
        type:Number,
        enum : [0, 1],
        default : 0,  
    },
    created_at : {type:Date, required:true},
    updated_at : {type:Date},
    deleted_at : {type:Date}
})

module.exports = mongoose.model('SubTask', SubTaskSchema);