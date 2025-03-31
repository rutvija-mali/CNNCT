import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    hostId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    hostName: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    startTime: {  
        type: Date,  
        required: true
    },
    timeZone: {
        type: String, 
        required: true
    },
    duration: {
        type: Number, 
        required: true
    },
    bannerColor: {
        type: String,
        required: true
    },
    bannerImg: {
        type: String,
        required: true
    },
    bannerText: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    emails: {
        type: [String],
        required: true
    },
    participants: [{ 
        type:[ mongoose.Schema.Types.ObjectId],
        ref: "Participants" 
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});

export default mongoose.model('Meeting', MeetingSchema);

