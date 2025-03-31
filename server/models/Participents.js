import mongoose from 'mongoose'

const ParticipantsSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    meeting:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Meeting",
        require:true
    },
    status:{
        type:String,
        enum:['Pending','Accepted','Rejected']
    },
    invitedAt:{
        type:Date,
        default:Date.now
    }
})

export default new mongoose.model('Participants',ParticipantsSchema)