import mongoose, { model } from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName:{
       type:String,
       required:true
    },
    lastName:{
       type:String,
       required:true
    },
    username:{
       type:String,
       required:true,
       unique:true
    },
    email:{
       type:String,
       required:true,
       unique:true
    },
    password:{
        type:String,
        required:true
    },
    toc:{
        type:Boolean,
        required:true
    },
    preference:{
        type:String,
        enum:["Sales","Education","Finance","Government and politics","Consulting","Recruiting","Tech","Marketing"]
    },
    availability:[{
        day:{
            type:String,
            required:true,
            enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        },
        slots:[{
            startTime:{ type: String, required: true },
            endTime:{ type: String, required: true },
            _id: false 
        }],
        _id: false 
  
    }],
    timeZone:{
        type:String,
       
    },
    createdAt:{
        type:Date,
        default:Date.now
    }



})

export default mongoose.model("User",UserSchema)