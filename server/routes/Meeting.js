import express, { response } from 'express'
import {errorLogger} from '../middlewares/logs.js'
import { authMiddleware } from '../middlewares/auth.js'
import dotenv from 'dotenv'
import multer from 'multer'
import User from '../models/User.js';
import Participants from '../models/Participents.js';
import Meetings from '../models/Meetings.js'
import mongoose from 'mongoose'


dotenv.config()
const MeettingRouter = express.Router()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

MeettingRouter.post('/',authMiddleware,upload.single('file'),async(req,res)=>{
try {
    const {
        topic, password,hostId, hostName, description, startTime, timeZone, 
        duration, link, emails, bannerColor, bannerText
    } = req.body;

    const bannerImg = req.file ? req.file.path : '';

   const emailArray = Array.isArray(emails) ? emails : (emails ? emails.split(",").map(email => email.trim()) : []);
   
   const meeting = new Meetings({
    topic, 
    password,
    hostId, 
    hostName, 
    description, 
    startTime, 
    timeZone, 
    duration, 
    link, 
    emails:emailArray, 
    bannerColor, 
    bannerText,
    bannerImg
   })
   await meeting.save(); 
   let participantIds = [];
    for(const email of emailArray){
        const user = await User.findOne({email:email})
        if(!user){
           return res.status(404).json({message:'Participant not found'})
        }

        const participant = new Participants({
         user:user._id,
         meeting:meeting._id,
         status:'Pending'
        })

        await participant.save()

        participantIds.push(participant._id);

    }
    meeting.participants =participantIds;

   await meeting.save()

   return res.status(201).json({meeting:'Meetting craeted successfuly'})
    
} catch (error) {
    errorLogger(error,req,res)
}
})

MeettingRouter.get('/',async(req,res)=>{
    try {
        const hostId = req.query.hostId||null
        const userId = req.query.userId||null
        const startTime = req.query.meetingDate || ''
        const participantsStatus= req.query.status||'Pending'

        let query ={}
       
        if (!hostId || !mongoose.isValidObjectId(hostId)) {
            return res.status(400).json({ error: 'Invalid hostId' });
          }
        if(hostId){
            query.hostId = hostId;
        }
        if(startTime){
            const now = moment()
            if(startTime == 'Upcoming'){
                query.startTime = {$gte : now.toISOString()}
            }else if(startTime == 'Past'){
                query.startTime = {$lt:now.toISOString()}
            }
        }

        if(userId){
            let participantQuery = { user: userId };
            if (participantsStatus) {
                participantQuery.status = participantsStatus; 

            }
            console.log("participant :"+JSON.stringify(participantQuery, null, 2));
            
            const participants = await Participants.find(participantQuery).select("_id");
            const participantIds = participants.map(p => p._id);

            console.log("Matching participant IDs:", participantIds);

            if (participantIds.length > 0) {
                query.participants = { $in: participantIds };
            } else {
                return res.status(200).json([]); 
            }
        }

        console.log('Final query:', JSON.stringify(query, null, 2));
        const meetings = await Meetings.find(query).populate('participants').exec()
        console.log('Found meetings:', meetings.length);
        return res.status(200).json(meetings);

    } catch (error) {
        errorLogger(error,req,res)
    }

})

 MeettingRouter.get('/:id',async(req,res)=>{
    try {
        const {id} =  req.params.id;
        const meeting = await Meetings.findById(id)
        if (!meeting) {
            return res.status(404).json({
              error: {
                message: 'meeting not found',
                status: 404
              }
            });
        }
        res.status(200).json(meeting)
    } catch (error) {
        errorLogger(error,req,res)
    }
})
export default MeettingRouter;