const mongoose = require('mongoose')

const TaskSchema  = mongoose.Schema({
    title : {type:String,required:true},
    description : {type:String},
    due_date : {type:Date, required:true},
    priority : {
        type :Number,
        enum :[0, 1, 2, 3]
    },
    users : [{
        _id : {type : mongoose.Types.ObjectId, required : true},
        priority : {
            type : Number,
            enum : [0, 1, 2],
            required : true
        }
    }],
    status : {
        type: String,
        enum : ["TODO", "IN_PROGRESS", "DONE"],
        default : "TODO",
    },
    total_subtask : {type:Number,default:0},
    completed_subtask : {type:Number,default:0},
    archived : {type:Boolean, default:false},
    created_at : {type:Date, required:true},
    updated_at : {type:Date},
    deleted_at : {type:Date}

})

module.exports = mongoose.model('Task', TaskSchema);